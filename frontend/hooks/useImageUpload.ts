import { useState, useRef, useCallback, useEffect } from 'react';

interface ImageChangeHandlerProps {
  (id: number, url: string | null, file: File | null): void;
}

export const useImageUpload = (onImageChange: ImageChangeHandlerProps, id: number) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type.startsWith('image')) {
      setSelectedImage(file);
      onImageChange(id, URL.createObjectURL(file), file);
    } else {
      setSelectedImage(null);
      onImageChange(id, null, null);
    }
  }, [id, onImageChange]);

  const handleDeleteImage = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';  // ファイル入力をクリア
    }
    setSelectedImage(null);
    setPreview('');
    onImageChange(id, null, null);
  }, [id, onImageChange]);

  // 選択した画像のプレビューを生成
  useEffect(() => {
    if (!selectedImage) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // メモリの解放
  }, [selectedImage]);

  return {
    selectedImage,
    preview,
    fileInputRef,
    handleImageChange,
    handleDeleteImage,
  };
};