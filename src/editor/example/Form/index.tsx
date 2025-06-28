import React, { useCallback, useContext, useReducer, useState } from 'react';
import { FormContext } from './FormContext';

const initialState = {
  fields: {}, // 存储字段的值 和错误信息
};

// 处理字段更新
function formReducer(state, action) {
  switch (action.type) {
    case 'setFieldValue':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.name]: {
            ...state.fields[action.name],
            value: action.value, // 最新的 value 更新
          },
        },
      };
    case 'setFieldError':
      return {
        // 返回出一个新的对象
        ...state,
        fields: {
          ...state.fields,
          [action.name]: {
            ...state.fields[action.name],
            error: action.error, // 最新的错误信息
          },
        },
      };

    default:
      return state;
  }
}
const Form = ({ form, onFinish, children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setFieldValue = useCallback((name, value) => {
    dispatch({ type: 'setFieldValue', name, value });
  }, []);

  const setFieldError = useCallback((name, error) => {
    dispatch({ type: 'setFieldError', name, error });
  }, []);

  const validateField = (field, value) => {
    const { rules = [] } = field;
    let error = null;

    for (let rule of rules) {
      if (rule.required && !value) {
        error = rule.message || '此字段不能为空';
        break;
      }

      if (rule.type === 'email' && !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value)) {
        error = rule.message || '邮箱格式不正确';
        break;
      }

      if (rule.min && value && value.length < rule.min) {
        error = rule.message || `至少需要 ${rule.min} 个字符`;
        break;
      }
    }

    return error;
  };

  // 获取字段的值
  const getFieldsValue = () => {
    return Object.keys(state.fields).reduce((acc, key) => {
      acc[key] = state.fields[key].value;
      return acc;
    }, {});
  };

  const submitForm = (e) => {
    e.preventDefault();
    let hasError = false;
    const errors = {};
    const values = getFieldsValue();

    React.Children.forEach(children, (child) => {
      if (child.type.name === 'Item') {
        const { name, rules = [] } = child.props;
        // 从数据里面获取表单项的值
        const value = values[name];

        let error = null;
        // 根据 用户传递的 rules 进行校验
        for (let rule of rules) {
          if (rule.required && !value) {
            error = rule.message || '此字段不能为空！';
            break;
          }
          if (rule.type === 'email' && !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value)) {
            error = rule.message || '邮箱格式不正确';
            break;
          }

          if (rule.min && value && value.length < rule.min) {
            error = rule.message || `至少需要 ${rule.min} 个字符`;
            break;
          }
        }
        if (error) {
          hasError = true;
          errors[name] = error;
        }
      }
    });

    // 设置错误
    Object.entries(errors).forEach(([name, error]) => {
      setFieldError(name, error);
    });
    // 没有错误的话，则调用提交方法
    if (!hasError) {
      onFinish(values);
    }
  };
  const formInstance = {
    setFieldValue,
    setFieldError,
    getFieldValue: (name) => state.fields[name]?.value,
    getFieldsValue,
    validateField,
  };

  return (
    <FormContext.Provider value={formInstance}>
      <form onSubmit={submitForm}>{children}</form>
    </FormContext.Provider>
  );
};

Form.useForm = () => {
  const [form] = useState(() => {
    return {
      setFieldValue: () => {},
      setFieldError: () => {},
      getFieldValue: () => {},
      getFieldsValue: () => ({}),
    };
  });

  return [form];
};

Form.Item = ({ name, label, rules = [], children }) => {
  // 获取到  from 实例
  const formInstance = useContext(FormContext);
  const value = formInstance.getFieldValue(name);
  const error = undefined;

  const handleChange = (e) => {
    const targetValue = e.target.value;
    formInstance.setFieldValue(name, targetValue);

    // 对单个字段进行实时校验 , 调用 form 实例的校验方法
    const errorMsg = formInstance.validateField({ rules }, targetValue);
    if (errorMsg) {
      formInstance.setFieldError(name, errorMsg);
    }
  };
  // 把 value 和 onChange 注入到子组件中
  const childNode = React.cloneElement(children, {
    value: value || '',
    onChange: handleChange,
  });
  return (
    <div style={{ marginBottom: 16 }}>
      <label>
        <strong>{label}</strong>
      </label>
      <div>{childNode}</div>
      {error && <small style={{ color: 'red' }}>{error}</small>}
    </div>
  );
};

export default Form;
