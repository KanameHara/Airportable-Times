//----------------------------------------------------------------
// 入力フォームコンポーネント
//----------------------------------------------------------------
import { Input } from '@chakra-ui/react';
import { FC } from 'react';

// Propsの型定義
interface InputFormProps {
  text: string;
  placeholder: string;
}

// <引数>
//  text:入力フォームの説明文
//  placeholder:入力フォームのプレースホルダ
const InputForm: FC<InputFormProps> = ({ text, placeholder }) => {
  return (
    <div>
      <p style={{marginBottom: '10px'}}>{text}</p>
      <Input w="300px" h="30px" placeholder={placeholder} />
    </div>
  );
}

export default InputForm;