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
import PostCard from "@/components/layouts/PostCard";
import Pagination from "@/components/layouts/Pagination";
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

  // 選択中の空港とカテゴリに該当する投稿データのみ取得
  const [posts, setPosts] = useState<PostInfoType[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts`, {
          params: {
            category: selectedCategory,
            airport_id: placeID
          }
        });

        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    if (selectedCategory && placeID) {
      fetchPosts();
    }
  }, [selectedCategory, placeID]);  

  // ページネーションのための設定
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const indexOfLastPost = currentPage * postsPerPage; // 現在のページで表示する最後の投稿のインデックス
  const indexOfFirstPost = indexOfLastPost - postsPerPage;  // 現在のページで表示する最初の投稿のインデックス
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);  // 現在のページで表示する投稿のリストを抽出
  const totalPages = Math.ceil(posts.length / postsPerPage);  // 総ページ数を計算

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
            <PostCard key={post.id} post={post} onClick={handlePostClick} />
          ))}
        </SimpleGrid>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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