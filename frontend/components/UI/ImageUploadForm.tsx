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
          <Button
            border="1px" 
            borderColor="blackAlpha.700"
            borderRadius="2px"
            fontWeight="normal"
            mt={2}
            onClick={() => fileInputRef.current?.click()}
          >
            ファイルを選択
          </Button>
          <input
            style={{ display: 'none' }}
            ref={fileInputRef}
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp, .svg"
            onChange={handleImageChange}
          />
        </Flex>
        <Flex ml={4}>
          {preview && <Image src={preview} alt="Preview" width={80} height={80} style={{ objectFit: 'cover' }} />}
        </Flex>
        {selectedImage && (
          <Button h={7} ml={5} mt={3} bg='red.200' onClick={handleDeleteImage}>
            削除
          </Button>
        )}
      </Flex>
    </div>
  );
};

export default React.memo(ImageUploadForm);