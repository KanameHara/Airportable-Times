//----------------------------------------------------------------
// 各空港投稿詳細画面
//----------------------------------------------------------------
import Head from "next/head"; 
import Header from "../../../../components/layouts/Header";
import { useRouter } from 'next/router';
import React, { FC, useState, useEffect } from 'react';
import { useMap } from '../../../../components/contexts/MapContext';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { PostInfoType } from "@/types/PostInfoType";
import {
  Text,
  Flex,
  Button,
  Image,
  Box
} from '@chakra-ui/react';

const AirportPostShow: FC = () => {

  // マップスタイルの定義
  const containerStyle: React.CSSProperties  = {
    width: '600px',
    height: '400px',
    marginLeft: '40px'
  };

  // URLからplaceIDとpostIDを取得
  const router = useRouter();
  const { placeID, id: postID } = router.query;

  // 未実装のためコメントアウト -->
  // postIDに紐づく投稿情報を取得
  // const [post, setPost] = useState<PostInfoType | null>(null);
  // const fetchPost = async () => {
  //   try {

  //     // 指定したpostIDの投稿データを取得
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts/${postID}`);
  //     setPost(response.data);
  //   } catch (error) {
  //     console.error('Error fetching post:', error);
  //   }
  // };

  // // 初回読み込み時にpostIDにもとづく投稿情報を取得
  // useEffect(() => {
  //   if (postID) {
  //     fetchPost();
  //   
  // }, [postID]);
  // 未実装のためコメントアウト <--
  
  // 選択空港の情報を取得
  const { selectedPlaceInfo } = useMap();

  // 戻るボタン押下時のハンドラ
  const handleBackButtonClick = () => {

    // 各空港投稿一覧に戻る
    router.push(`/${placeID}/posts`);
  }

  //投稿情報のサンプルなので後で削除(経度と緯度が逆になっているかも？なぜかマップ上にマーカーが表示されない)
  const post = {
    userID: 1,
    airport_id: "ChIJ-61QtY01QDUR4a_NVrCN6dw",
    category_id: 1,
    title: "テスト投稿",
    taking_at: "2021-08-01",
    location: "東京タワー",  // 任意の位置名
    taking_position_latitude: 35.6895,  // 任意の緯度
    taking_position_longitude: 139.6917,  // 任意の経度
    comment: "テストコメント",
    images: [
      "/images/sample/Boeing747.jpg",
      "/images/sample/Boeing777.jpg",
      "/images/sample/Boeing747.jpg",
      "/images/sample/Boeing777.jpg",
      "/images/sample/Boeing747.jpg",
    ]
  }

  // 現在の写真インデックスの状態管理
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 前の写真に移動
  const handlePreviousClick = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  // 次の写真に移動
  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <Head>
        <title>投稿詳細</title>
      </Head>
      <Header showButtonFlag={true} />
      <Box p={5} mt={10} shadow="md" borderWidth="1px" borderRadius="md" width="50%" mx="auto">
        <Text mt={5} ml={10} fontWeight="bold">{post.title}</Text>
        <Box mt={5} ml={10} display="flex" alignItems="center">
          <Button onClick={handlePreviousClick}>&lt;</Button>
          <Image src={post.images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            width="500px" 
            height="500px" 
            objectFit="contain" 
            ml={5} 
            mr={5}
          />
          <Button onClick={handleNextClick}>&gt;</Button>
        </Box>
        <Flex>
          <Text mt={5} ml={12} fontWeight="bold">撮影日：</Text>
          <Text mt={5} ml={5} fontWeight="bold">{post.taking_at}</Text>
        </Flex>
        <Flex>
          <Text mt={5} ml={12} fontWeight="bold">空港名：</Text>
          <Text mt={5} ml={5} fontWeight="bold">{selectedPlaceInfo.selectedPlace?.name}</Text>
        </Flex>
        <Flex>
          <Text mt={5} ml={12} fontWeight="bold">撮影場所名：</Text>
          <Text mt={5} ml={5} fontWeight="bold">{post.location}</Text>
        </Flex>
        <div style={{ marginTop: '15px', marginBottom: '50px' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: post.taking_position_latitude, lng: post.taking_position_longitude }}
            zoom={15}
          >
            <Marker position={{ lat: post.taking_position_latitude, lng: post.taking_position_longitude }}>
              <InfoWindow position={{ lat: post.taking_position_latitude, lng: post.taking_position_longitude }}>
                <div>撮影場所</div>
              </InfoWindow>
            </Marker>
          </GoogleMap>
        </div>
        <Flex>
          <Text mt={5} ml={12} fontWeight="bold">コメント：</Text>
        </Flex>
        <Flex>
          <Text mt={2} ml={20} fontWeight="bold">{post.comment}</Text>
        </Flex>
        <Button mt={10} mb={50} ml={500} colorScheme="blue" onClick={handleBackButtonClick} alignSelf="center">
          前の画面に戻る
        </Button>
      </Box>
    </div>
  );
};

export default AirportPostShow;