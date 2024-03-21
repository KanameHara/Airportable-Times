//----------------------------------------------------------------
// 入力フォームコンポーネント
//----------------------------------------------------------------
import { Input } from '@chakra-ui/react';

// <引数>
//  text:入力フォームの説明文
//  placeholder:入力フォームのプレースホルダ
function InputForm({text, placeholder}) {
  return (
    <div>
      <p style={{marginBottom: '10px'}}>{text}</p>
      <Input w="300px" h="30px" placeholder={placeholder} />
    </div>
  );
}
export default InputForm;