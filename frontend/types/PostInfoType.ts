// 投稿情報の型定義
export interface PostInfoType {
	id: bigint;
	user_id: bigint;
	airport_id: string;
	category_id: bigint;
	title: string;
	taking_at: string;
	location: string;
	taking_position_latitude: number;
	taking_position_longitude: number;
	comment: string;
	image_urls: string[];
}