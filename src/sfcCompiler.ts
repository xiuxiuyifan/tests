import * as SFCCompiler from '@vue/compiler-sfc';
import { babelParse } from '@vue/compiler-sfc';
import { transform } from 'sucrase';

const COMP_IDENTIFIER = `__sfc__`;

export async function compileCode(sourceCode) {
  const compiled = {};
  await compileFile(sourceCode, compiled);
  if (compiled.errors.length) {
    throw compiled.errors[0];
  } else {
    let jsCode = compiled.js;
    const ast = babelParse(jsCode, {
      sourceType: 'module',
    });
    const replaceCode = (node, subCode) =>
      jsCode.substring(0, node.start) + subCode + jsCode.substring(node.end);
    for (let i = ast.program.body.length - 1; i >= 0; i--) {
      const node = ast.program.body[i];
      if (node.type === 'ImportDeclaration') {
        jsCode = replaceCode(
          node,
          node.specifiers
            .map(
              (it) =>
                `const ${
                  it.local?.name || it.imported?.name || '*'
                } = ___magic__import__('${node.source.value}', '${it.imported?.name || '*'}');`,
            )
            .join('\r\n'),
        );
      } else if (node.type === 'ExportDefaultDeclaration') {
        jsCode = replaceCode(node, `return ${node.declaration.name}`);
      }
    }
    jsCode = `(function(){${jsCode}})()`;
    return {
      compileCss: compiled.css,
      compileJs: jsCode,
    };
  }
}

const uuid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
};

export async function compileFile(code, compiled) {
  const id = uuid();
  const filename = `${id}.vue`;
  const { errors, descriptor } = SFCCompiler.parse(code, {
    filename,
    sourceMap: true,
  });

  if (errors.length) {
    compiled.errors = errors;
    return;
  }

  if (hasVueCompositionFunctions(code) && !hasScriptSetup(code)) {
    compiled.errors = [
      'defineProps、defineExpose、defineEmits、defineSlots、defineOptions、defineModel需要在<script setup>下使用',
    ];
    return;
  }

  // 根据处理后的信息，编译script
  const scriptLang =
    (descriptor.script && descriptor.script.lang) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.lang);
  // 处理模板中Lang瞎写等情况
  const isTS = scriptLang === 'ts';
  if (scriptLang && !isTS) {
    compiled.errors = ['Only lang="ts" is supported for <script> blocks.'];
    return;
  }

  const hasScoped = descriptor.styles.some((s) => s.scoped);
  let clientCode = '';

  const appendSharedCode = (code) => {
    clientCode += code;
  };

  const clientScriptResult = await doCompileScript(descriptor, id, compiled, isTS);
  if (!clientScriptResult) {
    return;
  }
  const [clientScript, bindings] = clientScriptResult;
  clientCode += clientScript;

  // template
  // only need dedicated compilation if not using <script setup>
  if (descriptor.template && !descriptor.scriptSetup) {
    const clientTemplateResult = doCompileTemplate(descriptor, id, bindings, compiled);
    if (!clientTemplateResult) {
      return;
    }
    clientCode += clientTemplateResult;
  }

  if (hasScoped) {
    appendSharedCode(`\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`);
  }

  if (clientCode) {
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}` +
        `\nexport default ${COMP_IDENTIFIER}`,
    );
    compiled.js = clientCode.trimStart();
  }

  // styles
  let css = '';
  for (const style of descriptor.styles) {
    if (style.module) {
      compiled.errors = [`<style module> is not supported in the playground.`];
      return;
    }

    const styleResult = SFCCompiler.compileStyle({
      source: style.content,
      filename,
      id,
      scoped: style.scoped,
      modules: !!style.module,
    });
    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) {
        compiled.errors = styleResult.errors;
      }
      // proceed even if css compile errors
    } else {
      css += styleResult.code + '\n';
    }
  }
  if (css) {
    compiled.css = css.trim();
  } else {
    compiled.css = '/* No <style> tags present */';
  }

  // clear errors
  compiled.errors = [];
}

async function doCompileScript(descriptor, id, compiled, isTS) {
  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins = isTS ? ['typescript'] : undefined;
      const compiledScript = SFCCompiler.compileScript(descriptor, {
        id,
        refSugar: true,
        inlineTemplate: true,
      });
      let code = '';
      if (compiledScript.bindings) {
        code += `\n/* Analyzed bindings: ${JSON.stringify(compiledScript.bindings, null, 2)} */`;
      }
      code +=
        `\n` +
        SFCCompiler.rewriteDefault(compiledScript.content, COMP_IDENTIFIER, expressionPlugins);

      // 处理 ts 的情况
      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts') {
        code = await transformTS(code);
      }
      // console.log( SFCCompiler.rewriteDefault(compiledScript.content, COMP_IDENTIFIER))
      return [code, compiledScript.bindings];
    } catch (e) {
      compiled.errors = [e];
      return;
    }
  } else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined];
  }
}

function doCompileTemplate(descriptor, id, bindingMetadata, compiled) {
  const templateResult = SFCCompiler.compileTemplate({
    source: descriptor.template && descriptor.template.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some((s) => s.scoped),
    slotted: descriptor.slotted,
    isProd: false,
    compilerOptions: {
      bindingMetadata,
    },
  });
  if (templateResult.errors.length) {
    compiled.errors = templateResult.errors;
    return;
  }

  const fnName = `render`;

  return (
    `\n${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`,
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`
  );
}

function hasVueCompositionFunctions(content) {
  const regexPatterns = [/defineExpose\s*/, /defineProps\s*/, /defineEmits\s*/];
  for (const pattern of regexPatterns) {
    if (pattern.test(content)) {
      return true;
    }
  }
  return false;
}

function hasScriptSetup(content) {
  const regex = /<script\s+setup[^>]*>/;
  return regex.test(content);
}

// 编译ts 语法
async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript'],
    disableESTransforms: true,
  }).code;
}
