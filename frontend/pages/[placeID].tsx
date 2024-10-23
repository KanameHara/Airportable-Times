//----------------------------------------------------------------
// 各空港TOP画面
//----------------------------------------------------------------
import { useRouter } from 'next/router';
import { Button, Flex, Box, Text, CircularProgress } from '@chakra-ui/react'
import { useMap } from '../components/contexts/MapContext';
import { GoogleMap, Marker } from '@react-google-maps/api';
import Head from 'next/head';
import Header from '../components/layouts/Header';
import Image from 'next/image';
import React, { FC, useCallback, useState, useEffect } from 'react';
import { initializedSelectedPlaceInfo } from "@/constants/InitializedSelectedPlaceInfo";
import Footer from '@/components/layouts/Footer';
import PageHeading from '@/components/UI/PageHeading';
import HighlightedText from '@/components/UI/HighlightedText';

const AirportTop: FC = () => {
	
	// スタイルの定義
	const containerStyle: React.CSSProperties = {
		width: '622px',
		height: '430px',
		marginTop: '20px',
		marginLeft: '8px',
		borderRadius: '20px',
	};	

  const router = useRouter();
	const { placeID } = router.query;

	// マップの選択地情報を取得
	const { selectedPlaceInfo, updateSelectedPlaceInfo } = useMap();

	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const [isMarkerReady, setIsMarkerReady] = useState(false);

	useEffect(() => {
    if (selectedPlaceInfo.markerPosition) {
      setIsMarkerReady(true);
    }
  }, [selectedPlaceInfo.markerPosition]);

  const handlePreviousImageClick = () => {
		const photos = selectedPlaceInfo.selectedPlace?.photos ?? [];
		if (photos.length > 0) {
			setCurrentImageIndex((prevIndex) => 
				prevIndex === 0 ? photos.length - 1 : prevIndex - 1
			);
		}
	};

	const handleNextImageClick = () => {
		const photos = selectedPlaceInfo.selectedPlace?.photos ?? [];
		if (photos.length > 0) {
			setCurrentImageIndex((prevIndex) => 
				prevIndex === photos.length - 1 ? 0 : prevIndex + 1
			);
		}
	};

	const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

	const handlePreviousReviewClick = () => {
		const reviews = selectedPlaceInfo.selectedPlace?.reviews ?? [];
		if (reviews.length > 0) {
			setCurrentReviewIndex((prevIndex) =>
				prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
			);
		}
	};
	
	const handleNextReviewClick = () => {
		const reviews = selectedPlaceInfo.selectedPlace?.reviews ?? [];
		if (reviews.length > 0) {
			setCurrentReviewIndex((prevIndex) =>
				prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
			);
		}
	};	

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
				mt={111}
				shadow="md"
				borderWidth="1px"
				borderRadius={20}
				width="47%"
				height="auto"
				mx="auto"
				bg="white"
			>
				<PageHeading title={selectedPlaceInfo.selectedPlace.name} />
				<Flex direction="column" ml={1} mt={5}>
					<Box
						shadow="md"
						borderWidth="1px"
						flex="1"
						width="625px"
						borderRadius={20}
					>
						<Flex direction="row" justify="flex-start" align="center">
							<Box p={5} width="48%" flexShrink={0}>
								<Box borderRadius="10px" overflow="hidden">
									<Image
										src="/images/photo_sample.jpg"
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

				<Box mt={41}>
					<Button width="100px" ml={198} onClick={handlePreviousImageClick}>&lt; 前の画像</Button>
					<Button width="100px" ml={10} onClick={handleNextImageClick}>次の画像 &gt;</Button>
				</Box>
				{selectedPlaceInfo.selectedPlace.photos && selectedPlaceInfo.selectedPlace.photos.length > 0 && (
					<Flex direction="column" align="center" gap={4}>
						<Box
              p={3}
              overflow="hidden"
              width="100%"
              height="auto"
            >
              <Image 
                src={selectedPlaceInfo.selectedPlace.photos[currentImageIndex].getUrl()}
								alt={`Image ${currentImageIndex + 1}`} 
								width="700"
								height="480"
                objectFit="cover"
                style={{ borderRadius: '10px' }}
              />
						</Box>
					</Flex>
				)}

				<Box mt={5}>
          <HighlightedText text={"利用者レビュー"}  />
				</Box>
				<Box mt={3}>
					<Button width="125px" ml={173} onClick={handlePreviousReviewClick}>&lt; 前のレビュー</Button>
					<Button width="125px" ml={10} onClick={handleNextReviewClick}>次のレビュー &gt;</Button>
				</Box>
				<Text ml={1} mt={2}>
					{selectedPlaceInfo.selectedPlace.reviews && selectedPlaceInfo.selectedPlace.reviews.length > 0 && (
						<div>
							<Box
								p={4}
								bg='yellow.50'
								borderRadius="30px"
								border="1px"
								borderColor="gray.400"
							>
								<Flex>
									<CircularProgress
										value={
											selectedPlaceInfo.selectedPlace.reviews[currentReviewIndex]?.rating === 1 ? 20 :
											selectedPlaceInfo.selectedPlace.reviews[currentReviewIndex]?.rating === 2 ? 40 :
											selectedPlaceInfo.selectedPlace.reviews[currentReviewIndex]?.rating === 3 ? 60 :
											selectedPlaceInfo.selectedPlace.reviews[currentReviewIndex]?.rating === 4 ? 80 :
											selectedPlaceInfo.selectedPlace.reviews[currentReviewIndex]?.rating === 5 ? 100 : 0
										}
									/>
									<Text
										ml={2}
										mt={2.5}
										fontSize="20px"
										fontWeight='bold'
									>
										評価: {selectedPlaceInfo.selectedPlace.reviews[currentReviewIndex]?.rating}/5 点
									</Text>
								</Flex>
								<Text ml={1} mt={2}>
									{selectedPlaceInfo.selectedPlace.reviews[currentReviewIndex]?.text}
								</Text>	
							</Box>	
						</div>
					)}
        </Text>

				<GoogleMap
					mapContainerStyle={containerStyle}
					center={selectedPlaceInfo.center}
					zoom={selectedPlaceInfo.zoom}
				>
					{isMarkerReady && (
            <Marker position={selectedPlaceInfo.markerPosition} />
          )}
				</GoogleMap>
				
				<Button mt={7} mb={30} ml={5} onClick={handleBackButtonClick}>戻る</Button>
			</Box>
		</div>
	);
};

export default AirportTop;