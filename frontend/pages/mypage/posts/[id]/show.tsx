//----------------------------------------------------------------
// マイページ投稿詳細画面
//----------------------------------------------------------------
import Head from "next/head";
import Header from "@/components/layouts/Header";
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { PostInfoType } from "@/types/PostInfoType";
import {
  Text,
  Flex,
  Button,
  Image,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

const MyPagePostShow: FC = () => {

  // マップスタイルの定義
  const containerStyle: React.CSSProperties  = {
    width: '600px',
    height: '400px',
    marginLeft: '40px'
  };

  // routerを初期化
  const router = useRouter();

  // URLから投稿IDを取得
  // const { postID } = router.query; // 一旦コメントアウトで仮に1を設定
  const postID: bigint = BigInt(1);

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
  const handleConfirmDelete = () => {
    
    // ここでDBの削除処理を行う

    // モーダルを閉じる
    onClose();

    // マイページの投稿一覧画面に遷移
    router.push(`/mypage/posts`);
  };

  // 戻るボタン押下時のハンドラ
  const handleBackButtonClick = () => {
    
    // マイページの投稿一覧画面に戻る
    router.push(`/mypage/posts`);
  }

  return (
    <div>
      <Head>
        {/* <title>投稿{postID}詳細</title> エラー回避のため一旦コメントアウト*/}
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
          <Text mt={5} ml={5} fontWeight="bold">羽田空港</Text>
        </Flex>
        <Flex>
          <Text mt={5} ml={12} fontWeight="bold">撮影場所名：</Text>
          <Text mt={5} ml={5} fontWeight="bold">北側展望台</Text>
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
        <Button mt={10} mb={50} ml={260} mr={2} colorScheme="blue" alignSelf="center"
          onClick={() => handleEditButtonClick(postID)}
        >
          投稿を編集
        </Button>
        <Button mt={10} mb={50} mr={2} onClick={handleDeleteButtonClick} colorScheme="blue" alignSelf="center">
          投稿を削除
        </Button>
        <Button mt={10} mb={50} colorScheme="blue" onClick={handleBackButtonClick} alignSelf="center">
          前の画面に戻る
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>投稿を削除</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            本当に削除しますか？
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
              はい
            </Button>
            <Button variant="ghost" onClick={onClose}>
              いいえ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MyPagePostShow;
