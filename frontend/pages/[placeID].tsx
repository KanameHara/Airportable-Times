//----------------------------------------------------------------
// 各空港TOP画面
//----------------------------------------------------------------
import { useRouter } from 'next/router';
import { Button, Flex, Box, Text} from '@chakra-ui/react'
import { useMap } from '../components/contexts/MapContext';
import { GoogleMap, Marker } from '@react-google-maps/api';
import Head from 'next/head';
import Header from '../components/layouts/Header';
import Image from 'next/image';
import React, { FC } from 'react';

const AirportTop: FC = () => {
	
	// スタイルの定義
	const containerStyle: React.CSSProperties = {
		width: '800px',
		height: '350px',
		marginLeft: '40px',
		marginBottom: '40px'
	};	

  const router = useRouter();
	const { placeID } = router.query;
	const { selectedPlaceInfo } = useMap();
	const handleBackButtonClick = () => { router.push('/home'); };	// home画面に遷移する

	// 選択地なしの場合は何も表示しない
	if (!selectedPlaceInfo.markerPosition || !selectedPlaceInfo.selectedPlace) {
    return <div>Error: No selected place.</div>;
  }

	return (
		<div>
			<Head>
				<title>{selectedPlaceInfo.selectedPlace.name}</title>
			</Head>
			<Header userName="userName" showButtonFlag={true} />
			<h1 style={{ fontSize: '25px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px' }}>
				【{selectedPlaceInfo.selectedPlace.name}】
			</h1>
			{selectedPlaceInfo.selectedPlace.photos && selectedPlaceInfo.selectedPlace.photos.length > 0 && (
				<div style={{ marginLeft: '40px', marginBottom: '20px' }}>
					<Image
						src={selectedPlaceInfo.selectedPlace.photos[0].getUrl()}
						alt="空港の写真"
						width={500}
						height={500}
						objectFit="contain" // 画像が指定された枠に収まるように調整
					/>
				</div>
			)}
			<p style={{marginLeft: '40px', marginBottom: '20px'}}>住所 : {selectedPlaceInfo.selectedPlace.formatted_address}</p>
			<GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedPlaceInfo.center}
				zoom={selectedPlaceInfo.zoom}
			>
				<Marker position={selectedPlaceInfo.markerPosition} />
			</GoogleMap>
			<Flex direction="column" m={4}>
        <Box p={5} shadow="md" borderWidth="1px" flex="1" w="65%" >
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
              <Button colorScheme="blue" mt={3}>
                投稿一覧
              </Button>
            </Box>
            <Box p={5} w="auto" flexShrink={0}>
							<Image
								src="/images/airplane_01.jpg" alt="投稿画像例"
								width={500}
								height={500}
								objectFit="cover"
							/>
            </Box>
          </Flex>
        </Box>
      </Flex>
			<Button ml={700} mt={30} mb={100} onClick={handleBackButtonClick}>前の画面へ</Button>
		</div>
	);
};

export default AirportTop;