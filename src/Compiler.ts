import { compileCode } from './sfcCompiler';

export async function compileVue(code: string) {
  try {
    /*    const { compileScript, compileTemplate, parse } = await import('@vue/compiler-sfc');

    const { descriptor } = parse(code);
    const scriptCode = compileScript(descriptor, { id: 'vue-sfc' }).content;
    const templateCode = compileTemplate({ source: descriptor.template?.content || '' }).code;

    return `
      ${scriptCode}
      ${templateCode}
    `;*/
    return await compileCode(code);
  } catch (error: any) {
    console.error(error);
    throw new Error(error || error.message);
  }
}
