// !!!!各空港投稿作成画面へのルーティング確立のため、仮で作成しておく

//----------------------------------------------------------------
// 各空港投稿一覧画面
//----------------------------------------------------------------
import Head from "next/head"; 
import Header from "../../components/layouts/Header";
import { Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useMap } from '../../components/contexts/MapContext';


const PostList: FC = () => {

	// URLからplaceIDを取得
	const router = useRouter();
	const { placeID } = router.query;

	// 選択空港の情報を取得
	const { selectedPlaceInfo } = useMap();

	// 投稿作成ボタン押下時のハンドラ
	const handleCreatePostButtonClick = () => {
		// URLから基本のパスを抽出（クエリパラメーターやハッシュを無視）
		let basePath = router.asPath.split('?')[0]; // クエリパラメーターを除去

		// 末尾の「/postlist」を削除
		basePath = basePath.replace(/\/postlist$/, '');
	
		// 投稿作成画面に遷移
		router.push(`${basePath}/createpost`);
	}

	// 戻るボタン押下時のハンドラ
	const handleBackButtonClick = () => {
		// 各空港TOP画面に戻る
		router.push(`/${placeID}`);
  }

	return (
		<div>
			<Head>
				<title>{selectedPlaceInfo.selectedPlace?.name}投稿一覧</title>
			</Head>
			<Header showButtonFlag={true} />	
			<Text>【{selectedPlaceInfo.selectedPlace?.name}投稿一覧】</Text>
			<Button colorScheme="blue" onClick={handleCreatePostButtonClick}>
        投稿作成
			</Button>
			<Button colorScheme="blue" onClick={handleBackButtonClick}>
        戻る
      </Button>
		</div>
	);
};

export default PostList;