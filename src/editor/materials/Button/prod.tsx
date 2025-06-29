import { Button as AntdButton } from 'antd';
import { ButtonType } from 'antd/es/button';
import { CommonComponentProps } from '../../interface';

export interface ButtonProps {
  type: ButtonType;
  text: string;
}

const ButtonProd = ({ type, text, id, styles, ...props }: CommonComponentProps) => {
  return (
    <AntdButton type={type} style={styles} {...props}>
      {text}
    </AntdButton>
  );
};

export default ButtonProd;
