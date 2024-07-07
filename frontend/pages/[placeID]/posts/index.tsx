//----------------------------------------------------------------
// 各空港投稿一覧画面
//----------------------------------------------------------------
import Head from "next/head"; 
import Header from "../../../components/layouts/Header";
import { useRouter } from 'next/router';
import React, { FC, useState, useEffect } from 'react';
import { useMap } from '../../../components/contexts/MapContext';
import axios from 'axios';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { PostInfoType } from "@/types/PostInfoType";
import {
  Text,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Image,
  SimpleGrid
} from '@chakra-ui/react';

const AirportPostIndex: FC = () => {

  // URLからplaceIDを取得
  const router = useRouter();
  const { placeID } = router.query;

  // 選択空港の情報を取得
  const { selectedPlaceInfo } = useMap();

  // 投稿種別データの初期化
  interface Category {
    id: bigint;
    name: string;
  }
  const [categories, setCategories] = useState<Category[]>([]);

  // 選択中の投稿種別の初期化(初期値は「航空機・風景」を選択した状態としておく)
  const [selectedCategory, setSelectedCategory] = useState<bigint>(BigInt(1));

  // 投稿種別選択時のハンドラ
  const handleSelect = (categoryId: bigint) => {
    setSelectedCategory(categoryId);
  }

  // 投稿種別データを取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/categories`);
        setCategories(response.data);
        
        // カテゴリのデータ取得後に初期選択状態を設定
        setSelectedCategory(response.data[0].id);
      }
      catch (error){
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // 選択中のカテゴリに従って投稿データを取得
  const [posts, setPosts] = useState<PostInfoType[]>([]);

  // 表示テストのため投稿データを仮で作成
  useEffect(() => {
    const createSamplePosts = (): PostInfoType[] => {
      const samplePost: PostInfoType = {
        id: BigInt(1),
        airport_id: "AAA",
        category_id: BigInt(1),
        title: 'テスト投稿',
        taking_at: '2021-01-01 00:00:00',
        location: "テスト場所",
        taking_position_latitude: 135,
        taking_position_longitude: 35,
        comment: 'テスト投稿コメント',
      };
      return Array.from({ length: 25 }, (_, i) => ({ ...samplePost, id: BigInt(i + 1), title: `テスト投稿${i + 1}`}));
    };
    setPosts(createSamplePosts());
  }, []);
  const imageUrl = "/images/sample/Boeing747.jpg";

  // 未実装のためコメントアウト
  // useEffect(() => {
    // const fetchPosts = async () => {
      // try {
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts?category=${selectedCategory}`);
        // setPosts(response.data);
      // }
      // catch (error){
        // console.error('Error fetching posts:', error);
      // }
    // };
// 
    // if (selectedCategory) {
      // fetchPosts();
    // }
  // }, [selectedCategory]);

  // ページネーションのための設定
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const indexOfLastPost = currentPage * postsPerPage; // 現在のページで表示する最後の投稿のインデックス
  const indexOfFirstPost = indexOfLastPost - postsPerPage;  // 現在のページで表示する最初の投稿のインデックス
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);  // 現在のページで表示する投稿のリストを抽出
  const totalPages = Math.ceil(posts.length / postsPerPage);  // 総ページ数を計算

  // 各投稿クリック時のハンドラ
  const handlePostClick = (postId: bigint) => {

    // 投稿詳細画面に遷移
    router.push(`/${placeID}/posts/${postId}/show`);
  }

  // 投稿作成ボタン押下時のハンドラ
  const handleCreatePostButtonClick = () => {

    // 投稿作成画面に遷移
    router.push(`/${placeID}/posts/create`);
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
      <Box p={5} mt={10} shadow="md" borderWidth="1px" borderRadius="md" width="80%" mx="auto">
        <h1 style={{ fontSize: '25px', marginBottom: '20px' }}>
          【{selectedPlaceInfo.selectedPlace?.name}投稿一覧】
        </h1>
        <Text mt={5} ml={10} fontWeight="bold">投稿のカテゴリーを選択できます。</Text>
        <Flex>
          <Menu>
            <MenuButton as={Button} mt={5} ml={70} rightIcon={<ChevronDownIcon />}>
              {categories.length > 0 
                ? categories.find(category => category.id === selectedCategory)?.name || 'カテゴリを選択'
                : 'カテゴリを選択'}
            </MenuButton>
            <MenuList>
              {categories.map((category) => (
                <MenuItem key={category.id} onClick={() => handleSelect(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
        <SimpleGrid columns={3} spacing={2} m={10}>
          {currentPosts.map((post) => (
            <Box key={post.id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="300px" height="300px"
              onClick={() => handlePostClick(post.id)}
              cursor="pointer" // ポインタカーソルを追加してクリック可能に見せる
            >
              <Image src={imageUrl} alt={post.title} objectFit="cover" height="200px"/>
              <Box p="6">
                <Box display="flex" alignItems="baseline">
                  <Text fontWeight="bold" as="h4" lineHeight="tight" isTruncated>
                    {post.title}
                  </Text>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        <Flex justifyContent="center" mb={5}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i} onClick={() => setCurrentPage(i + 1)} disabled={currentPage === i + 1} mx={1}>
              {i + 1}
            </Button>
          ))}
        </Flex>
        <Flex justifyContent="center">
          <Button colorScheme="blue" onClick={handleCreatePostButtonClick} mx={2}>
            投稿作成
          </Button>
          <Button colorScheme="blue" onClick={handleBackButtonClick} mx={2}>
            戻る
          </Button>
        </Flex>
      </Box>
    </div>
  );
};

export default AirportPostIndex;