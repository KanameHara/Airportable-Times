//----------------------------------------------------------------
// 各空港投稿一覧画面
//----------------------------------------------------------------
import Head from "next/head"; 
import Header from "../../../components/layouts/Header";
import { useRouter } from 'next/router';
import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { useMap } from '../../../components/contexts/MapContext';
import axios from 'axios';
import { PostInfoType } from "@/types/PostInfoType";
import PostCard from "@/components/UI/PostCard";
import Pagination from "@/components/UI/Pagination";
import CategoryDropdown from "@/components/UI/CategoryDropdown";
import Footer from "@/components/layouts/Footer";
import PageHeading from "@/components/UI/PageHeading";
import {
  Text,
  Flex,
  Button,
  Box,
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

  const handleSelect = useCallback((categoryId: bigint) => {
    setSelectedCategory(categoryId);
  }, []);

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
    if (!selectedCategory || !placeID) return;
    
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
    
    fetchPosts();
  }, [selectedCategory, placeID]);  

  // ページネーションのための設定
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const indexOfLastPost = currentPage * postsPerPage; // 現在のページで表示する最後の投稿のインデックス
  const indexOfFirstPost = indexOfLastPost - postsPerPage;  // 現在のページで表示する最初の投稿のインデックス
  const currentPosts = useMemo(() => posts.slice(indexOfFirstPost, indexOfLastPost), [posts, indexOfFirstPost, indexOfLastPost]);
  const totalPages = useMemo(() => Math.ceil(posts.length / postsPerPage), [posts.length, postsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePostClick = useCallback((postId: bigint) => {
    router.push(`/${placeID}/posts/${postId}/show`);
  }, [router, placeID]);

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
      <Box
        p={5}
        mt={10}
        bg="white"
        shadow="md"
        borderWidth="1px"
        borderRadius="20px"
        width="1100px"
        mx="auto"
      >
        <PageHeading title={`${selectedPlaceInfo.selectedPlace?.name} 投稿一覧`} />
        <Text mt={7} fontSize="16px">投稿のカテゴリーを選択できます。</Text>
        <Flex justifyContent="flex-start" mt={5} ml={1}>
          <CategoryDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleSelect}
          />
          <Button
            ml={660}
            bg="blue.400"
            color="white"
            onClick={handleCreatePostButtonClick}>
            投稿作成
          </Button>
          <Button ml={5} onClick={handleBackButtonClick}>
            戻る
          </Button>
        </Flex>
        <SimpleGrid columns={3} mt={10} ml={10} rowGap={7}>
          {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={handlePostClick} text={""} />
          ))}
        </SimpleGrid>
        <Flex mt={10} justifyContent="center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </Flex>
      </Box>
      <Footer />
    </div>
  );
};

export default AirportPostIndex;