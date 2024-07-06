//----------------------------------------------------------------
// 各空港TOP画面
//----------------------------------------------------------------
import { useRouter } from 'next/router';
import { Button, Flex, Box, Text } from '@chakra-ui/react'
import { useMap } from '../components/contexts/MapContext';
import { GoogleMap, Marker } from '@react-google-maps/api';
import Head from 'next/head';
import Header from '../components/layouts/Header';
import Image from 'next/image';
import React, { FC, useCallback } from 'react';
import { initializedSelectedPlaceInfo } from "@/constants/InitializedSelectedPlaceInfo";

const AirportTop: FC = () => {
	
	// スタイルの定義
	const containerStyle: React.CSSProperties = {
		width: '600px',
		height: '350px',
		marginBottom: '40px',
		marginLeft: '185px'
	};	

  const router = useRouter();
	const { placeID } = router.query;

	// マップの選択地情報を取得
	const { selectedPlaceInfo, updateSelectedPlaceInfo } = useMap();

	// 戻るボタンクリック時のハンドラ
	const handleBackButtonClick = useCallback(() => {

		// ここでマップの選択状態を初期化
    updateSelectedPlaceInfo(initializedSelectedPlaceInfo);
    
		// 初期化後にホーム画面に遷移
		router.push('/home');
  }, [updateSelectedPlaceInfo, router]);
  
	// 選択地なしの場合は何も表示しない
	if (!selectedPlaceInfo.markerPosition || !selectedPlaceInfo.selectedPlace) {
    return <div>Error: No selected place.</div>;
  }

	// 投稿一覧ボタンクリック時のハンドラ
	const handlePostListButtonClick = () => {

		// 投稿一覧画面に遷移
		const currentPath = router.asPath;
		router.push(`${currentPath}/posts`);
	}

	return (
		<div>
			<Head>
				<title>{selectedPlaceInfo.selectedPlace.name}</title>
			</Head>
			<Header showButtonFlag={true} />
			<Box p={5} mt={10} shadow="md" borderWidth="1px" borderRadius="md" width="70%" height="auto" mx="auto">
				<h1 style={{ fontSize: '25px',marginLeft: '150px', marginBottom: '20px' }}>
					【{selectedPlaceInfo.selectedPlace.name}】
				</h1>
				<Flex ml={10}>
					{selectedPlaceInfo.selectedPlace.photos && selectedPlaceInfo.selectedPlace.photos.length > 0 && (
						<div style={{ marginBottom: '20px', marginLeft: '150px'}}>
							<Image
								src={selectedPlaceInfo.selectedPlace.photos[0].getUrl()}
								alt="空港の写真"
								width={500}
								height={500}
								objectFit="contain" // 画像が指定された枠に収まるように調整
							/>
						</div>
					)}
				</Flex>
				<p style={{ marginBottom: '20px', marginLeft: '180px' }}>住所 : {selectedPlaceInfo.selectedPlace.formatted_address}</p>
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={selectedPlaceInfo.center}
					zoom={selectedPlaceInfo.zoom}
				>
					<Marker position={selectedPlaceInfo.markerPosition} />
				</GoogleMap>
				<Flex direction="column" m={4} ml={185}>
					<Box p={5} shadow="md" borderWidth="1px" flex="1" w="80%">
						<Flex direction="row" justify="flex-start" align="center">
							<Box p={5}>
								<Text fontSize="xl" fontWeight="bold">
									ゲストのみなさんが
								</Text>
								<Text fontSize="xl" fontWeight="bold">
									投稿した航空関連フォトを
								</Text>
								<Text fontSize="xl" fontWeight="bold">
									確認することができます
								</Text>
								<Button colorScheme="blue" mt={3} onClick={handlePostListButtonClick}>
									投稿一覧
								</Button>
							</Box>
							<Box p={5} width="50%" flexShrink={0}>
								<Image
									src="/images/airplane_01.jpg"
									alt="投稿画像例"
									width={420}
									height={500}
									objectFit="cover"
								/>
							</Box>
						</Flex>
					</Box>
				</Flex>
				<Button mt={5} mb={100} ml={700} onClick={handleBackButtonClick}>前の画面へ</Button>
			</Box>
		</div>
	);
};

export default AirportTop;