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
import Footer from '@/components/layouts/Footer';

const AirportTop: FC = () => {
	
	// スタイルの定義
	const containerStyle: React.CSSProperties = {
		width: '700px',
		height: '480px',
		marginTop: '20px',
		marginLeft: '8px',
		borderRadius: '20px',
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

	const handleCreatePostButtonClick = () => {
    router.push(`/${placeID}/posts/create`);
  }

	return (
		<div>
			<Head>
				<title>{selectedPlaceInfo.selectedPlace.name}</title>
			</Head>
			<Header showButtonFlag={true} />
			<Box
				p={5}
				mt={79}
				shadow="md"
				borderWidth="1px"
				borderRadius={20}
				width="47%"
				height="auto"
				mx="auto"
				bg="white"
			>
				<Flex alignItems="center">
          <Box 
            width="10px"
            height="50px"
            bg="blue.500"
            mr={3}
          />
          <Box fontSize="3xl" fontWeight="bold">
						{selectedPlaceInfo.selectedPlace.name}
          </Box>
        </Flex>
				<Flex mt={10} ml={1}>
				{selectedPlaceInfo.selectedPlace.photos && selectedPlaceInfo.selectedPlace.photos.length > 0 && (
						<Flex direction="column" align="center" gap={4}>
            {selectedPlaceInfo.selectedPlace.photos.slice(0, 2).map((photo, index) => (
              <Box key={index} borderRadius="20px" overflow="hidden">
								<Image
									src={photo.getUrl()}
									alt={`空港の写真${index + 1}`}
									width={700}
									height={480}
									objectFit="contain"
								/>
							</Box>
            ))}
          </Flex>
        )}
				</Flex>
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={selectedPlaceInfo.center}
					zoom={selectedPlaceInfo.zoom}
				>
					<Marker position={selectedPlaceInfo.markerPosition} />
				</GoogleMap>
				<Flex direction="column" ml={2} mt={5}>
					<Box
						shadow="md"
						borderWidth="1px"
						flex="1"
						width="700px"
						borderRadius={20}
					>
						<Flex direction="row" justify="flex-start" align="center">
							<Box p={5} width="50%" flexShrink={0}>
								<Box borderRadius="10px" overflow="hidden">
									<Image
										src="/images/airplane_01.jpg"
										alt="投稿画像例"
										width={420}
										height={300}
										objectFit="cover"
									/>
								</Box>
							</Box>
							<Box p={5}>
								<Text fontSize="16px" >
									ゲストの皆さんによる投稿をチェック<br />
									または作成してみましょう！
								</Text>
								<Flex mt={5}>
									<Button bg='blue.400' color='white' mt={3} ml={7} onClick={handlePostListButtonClick}>
										投稿一覧
									</Button>
									<Button bg='blue.400' color='white' mt={3} ml={5} onClick={handleCreatePostButtonClick}>
										投稿作成
									</Button>
								</Flex>
							</Box>
						</Flex>
					</Box>
				</Flex>
				<Button mt={5} mb={30} ml={580} onClick={handleBackButtonClick}>前の画面へ</Button>
			</Box>
			<Footer />
		</div>
	);
};

export default AirportTop;