//----------------------------------------------------------------
// マイページ投稿詳細画面
//----------------------------------------------------------------
import React, { FC, useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Header from '@/components/layouts/Header';
import { useRouter } from 'next/router';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { PostInfoType } from '@/types/PostInfoType';
import axios from 'axios';
import ConfirmModal from '@/components/UI/ConfirmModal';
import Footer from '@/components/layouts/Footer';
import HighlightedText from '@/components/UI/HighlightedText';
import PageHeading from '@/components/UI/PageHeading';
import {
  Text,
  Flex,
  Button,
  Image,
  Box,
  useDisclosure,
} from '@chakra-ui/react';

const MyPagePostShow: FC = () => {

  // マップスタイルの定義
  const containerStyle: React.CSSProperties  = {
    width: '700px',
    height: '480px',
    marginLeft: '6px',
    borderRadius: '20px',
  };

  // routerを初期化
  const router = useRouter();

  // URLから投稿IDを取得
  const { id: postID } = router.query;

  // 初回読み込み時にpostIDにもとづく投稿情報を取得
  const [post, setPost] = useState<PostInfoType | null>(null);
  const [airportName, setAirportName] = useState<string>('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL}/posts`, {
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

        // バックエンドのエンドポイント経由でGoogle Places APIで空港名を取得
        const placesResponse = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL}/places/show`, {
          params: {
            place_id: postData.airport_id
          }
        });
        setAirportName(placesResponse.data.result.name);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    
    if (postID) {
      fetchPost();
    }
  }, [postID]);

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

  const [isMarkerReady, setIsMarkerReady] = useState(false);
  useEffect(() => {
    if (post?.taking_position_latitude && post?.taking_position_longitude) {
      setIsMarkerReady(true);
    }
  }, [post?.taking_position_latitude, post?.taking_position_longitude]);

  // useDisclosureフックを使用してモーダルの状態を管理
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 編集ボタン押下時のハンドラ
  const handleEditButtonClick = (postId: bigint) => {
    
    // 編集画面に遷移
    router.push(`/mypage/posts/${postId}/edit`);
  };

  // 削除ボタン押下時のハンドラ
  const handleDeleteButtonClick = () => {

    // 確認モーダルを開く
    onOpen();
  };

  // モーダルで削除確認後、削除ボタン押下時のハンドラ
  const handleConfirmDelete = useCallback(async () => {
    try {

      // DBから投稿データを削除する
      await axios.delete(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL}/posts/${postID}`);
      
      // モーダルを閉じる
      onClose();

      // マイページの投稿一覧画面に遷移
      router.push(`/mypage/posts`);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }, [postID, onClose, router]);

  // 戻るボタン押下時のハンドラ
  const handleBackButtonClick = () => {
    
    // マイページの投稿一覧画面に戻る
    router.push(`/mypage/posts`);
  }

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
      <Box
        p={5}
        mt={111}
        shadow="md"
        borderWidth="1px"
        borderRadius="20px"
        width="47%"
        mx="auto"
        bg="white"
      >
        <PageHeading title={post.title} />
        <Box ml={3.5} mt={5} display="flex" alignItems="center">
          <Button onClick={handlePreviousClick}>&lt;</Button>
          <Box
            p={3}
            overflow="hidden"
            width={{ base: "100%", md: "600px" }}
            height={{ base: "auto", md: "400px" }}
          >
            <Image 
              src={post.image_urls[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              width="100%"   
              height="100%"  
              objectFit="cover"
              style={{ borderRadius: '10px' }}
            />
          </Box>
          <Button onClick={handleNextClick}>&gt;</Button>
        </Box>
        <Box mt={5}>
          <HighlightedText text={"撮影日"}  />
        </Box>
        <Text ml={1}>{post.taking_at}</Text>
        <Box mt={2}>
          <HighlightedText text={"空港名"}  />
        </Box>
        <Text ml={1}>{airportName}</Text>
        <Box mt={2}>
          <HighlightedText text={"撮影場所名"}  />
        </Box>
        <Text ml={1} mb={3}>{post.location}</Text>
        <div style={{ marginTop: '15px', marginBottom: '50px' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: post.taking_position_latitude, lng: post.taking_position_longitude }}
            zoom={15}
          >
            {isMarkerReady && (
              <Marker position={{ lat: post.taking_position_latitude, lng: post.taking_position_longitude }} />
            )}
          </GoogleMap>
        </div>
        <Box mt={5}>
          <HighlightedText text={"コメント"}  />
        </Box>
        <Text ml={1} mb={3}>
          {post.comment.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Text>
        <Button mt={10} ml={5} mb={5} onClick={handleBackButtonClick}>
          戻る
        </Button>
        <Button mt={10} ml={455} mb={5} bg="blue.400" color="white"
          onClick={() => handleEditButtonClick(post.id)}
        >
          編集
        </Button>
        <Button mt={10} ml={5} mb={5} bg="blue.400" color="white" onClick={handleDeleteButtonClick}>
          削除
        </Button>
      </Box>

      <ConfirmModal isOpen={isOpen} onClose={onClose} onConfirm={handleConfirmDelete} mainText='投稿を削除' confirmText='本当に削除しますか？' />
      <Footer />
    </div>
  );
};

export default MyPagePostShow;
