//----------------------------------------------------------------
// 画像アップロードフォームコンポーネント
//----------------------------------------------------------------
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button, Flex } from '@chakra-ui/react';
import { ImageUploadFormPropsType } from '@/types/ImageUploadFormPropsType';

const ImageUploadForm: React.FC<ImageUploadFormPropsType> = ({ id, onImageChange }) => {

  // 選択した画像ファイルの一時保管場所
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // プレビュー画像URLの一時保管場所
  const [preview, setPreview] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);  // ファイル選択用のinput要素の参照

  // 画像選択時のハンドラ
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // 選択された画像ファイルリストを取得
    const file = e.target.files && e.target.files[0];
    // ファイルタイプがimageか確認
    if (file && file.type.startsWith('image')) {
      setSelectedImage(file);
      onImageChange(id, URL.createObjectURL(file), file);
    } else {
      setSelectedImage(null);
      onImageChange(id, null, null);
    }
  };

  // 選択画像からプレビューを生成。選択画像が変更されるときだけ実行
  React.useEffect(() => {

    // 画像未選択ならプレビューと選択状態を空にして終了
    if (!selectedImage) {
      setPreview('');
      onImageChange(id, null, null);
      return;
    }

    // 選択画像をオブジェクトURLに変換
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);
    onImageChange(id, objectUrl, selectedImage);

    // クリーンアップ関数を返す。生成したURLが不要になった時（別画像選択時やコンポーネントアンマウント時）に明示的にメモリ解放
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage, id, onImageChange]);

  // 画像の削除ボタンハンドラ
  const handleDeleteImage = () => {

    // ファイル選択用のinput要素をクリア
    if (fileInputRef.current) {
      fileInputRef.current.value = "";  // input要素の値をクリア
    }

    // 選択した画像の状態をリセット
    setSelectedImage(null);

    // プレビューをクリア
    setPreview('');

    // 親コンポーネントに画像が削除されたことを通知
    onImageChange(id, null, null);
  };

  return (
    <div>
      <Flex>
        <Flex mt={10} ml={5}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} />
        </Flex>
        <Flex mt={10} ml={1}>
          {preview && <Image src={preview} alt="Preview" width={80} height={80} style={{ objectFit: 'cover' }} />}
        </Flex>
        <Button h={7} mt={10} ml={5} onClick={handleDeleteImage} disabled={!selectedImage}>
          削除
        </Button>
      </Flex>
    </div>
  );
}

export default React.memo(ImageUploadForm);