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
import Footer from "@/components/layouts/Footer";
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
  
  // 初回読み込み時にpostIDにもとづく投稿情報を取得
  const [post, setPost] = useState<PostInfoType | null>(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts`, {
          params: {
            id: postID
          }
        });

        // 画面に表示したい投稿データは配列の[0]番目に格納されている
        const postData = response.data[0];

        // 緯度経度がstring型で取得されるので数値に変換
        postData.taking_position_latitude = parseFloat(postData.taking_position_latitude);
        postData.taking_position_longitude = parseFloat(postData.taking_position_longitude);

        // 投稿データを設定
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    
    if (postID) {
      fetchPost();
    }
  }, [postID]);
  
  // 選択空港の情報を取得
  const { selectedPlaceInfo } = useMap();

  // 戻るボタン押下時のハンドラ
  const handleBackButtonClick = () => {

    // 各空港投稿一覧に戻る
    router.push(`/${placeID}/posts`);
  }

  // 現在の写真インデックスの状態管理
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 前の写真に移動
  const handlePreviousClick = () => {
    if (post && post.image_urls.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? post.image_urls.length - 1 : prevIndex - 1
      );
    }
  };

  // 次の写真に移動
  const handleNextClick = () => {
    if (post && post.image_urls.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === post.image_urls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // 投稿データが読み込めなければ何も表示しない
  if (!post) {
    return <div>Loading...</div>;
  }
  
  if (!post.image_urls || post.image_urls.length === 0) {
    return <div>画像がありません</div>;
  }

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
          <Image src={post.image_urls[currentImageIndex]}
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
      <Footer />
    </div>
  );
};

export default AirportPostShow;