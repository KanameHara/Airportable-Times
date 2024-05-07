// 画像アップロードフォームのプロパティの型定義
export interface ImageUploadFormPropsType {
  id: number;
  onImageChange: (id: number, url: string | null) => void;
}