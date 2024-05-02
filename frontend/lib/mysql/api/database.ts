//----------------------------------------------------------------
// MysqlとのAPI
//----------------------------------------------------------------
import axios from 'axios';
import { UserInfoType } from '@/types/UserInfoType';

// mailアドレスからユーザ情報を取得
export const fetchUserInfoByEmail = async (email: string | null | undefined) => {
  if (!email) {
    return null;
  }

	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/users/find_by_email`,
			{ params: { email } }
		);
    return response.data;
  } catch (error: any) {
    return error.response.data.error;  // エラーメッセージを返す
  }
};