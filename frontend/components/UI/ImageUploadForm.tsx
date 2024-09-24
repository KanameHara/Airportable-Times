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
        <Flex>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp, .svg"
            onChange={handleImageChange}
          />
        </Flex>
        <Flex>
          {preview && <Image src={preview} alt="Preview" width={80} height={80} style={{ objectFit: 'cover' }} />}
        </Flex>
        {selectedImage && (
          <Button h={7} ml={5} bg='red.200' onClick={handleDeleteImage}>
            削除
          </Button>
        )}
      </Flex>
    </div>
  );
};

export default React.memo(ImageUploadForm);