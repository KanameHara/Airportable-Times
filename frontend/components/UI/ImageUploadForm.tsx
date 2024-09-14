//----------------------------------------------------------------
// 画像アップロードフォームコンポーネント
//----------------------------------------------------------------
import React from 'react';
import Image from 'next/image';
import { Button, Flex } from '@chakra-ui/react';
import { ImageUploadFormPropsType } from '@/types/ImageUploadFormPropsType';
import { useImageUpload } from '@/hooks/useImageUpload';

const ImageUploadForm: React.FC<ImageUploadFormPropsType> = ({ id, onImageChange }) => {
  const {
    selectedImage,
    preview,
    fileInputRef,
    handleImageChange,
    handleDeleteImage
  } = useImageUpload(onImageChange, id);

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