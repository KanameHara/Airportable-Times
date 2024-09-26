//----------------------------------------------------------------
// マイページ投稿一覧画面
//----------------------------------------------------------------
import { useRouter } from 'next/router';
import { useAuth } from '../../../components/contexts/AuthContext';
import React, { FC, useEffect, useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Header from '../../../components/layouts/Header';
import { UserInfoType } from '@/types/UserInfoType';
import { fetchUserInfoByEmail } from '@/lib/mysql/api/database';
import { PostInfoType } from '@/types/PostInfoType';
import axios from 'axios';
import PostCard from '@/components/UI/PostCard';
import Pagination from '@/components/UI/Pagination';
import CategoryDropdown from '@/components/UI/CategoryDropdown';
import Footer from '@/components/layouts/Footer';
import PageHeading from '@/components/UI/PageHeading';
import {
  Flex,
  Box,
  Text,
  SimpleGrid,
} from '@chakra-ui/react'

const MyPagePostIndex: FC = () => {
	
  // routerの初期化
  const router = useRouter();

	// ユーザー情報を取得
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  useEffect(() => {
    const getUserInfo = async () => {
      const info = await fetchUserInfoByEmail(currentUser?.email);
      setUserInfo(info);
    };

    if (currentUser?.email) {
      getUserInfo();
    }
  }, [currentUser?.email]);
  
  // 投稿種別データの初期化
  interface Category {
    id: bigint;
    name: string;
  }
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<bigint>(BigInt(0));

  const handleSelect = useCallback((categoryId: bigint) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }, []);

  // 投稿種別データを取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/categories`);
        setCategories(response.data);
        
        const allCategory = { id: BigInt(0), name: '指定なし' };
        setCategories([allCategory, ...response.data]);
      }
      catch (error){
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);
	
	// ユーザー投稿データのうち選択中のカテゴリーのものを取得
  const [posts, setPosts] = useState<PostInfoType[]>([]);
  useEffect(() => {
    if (((selectedCategory < 0) && (selectedCategory > 4)) || !userInfo?.id) return;
    
    const fetchPosts = async () => {
      try {
        const params: any = { user_id: userInfo.id };
        
        if (selectedCategory !== BigInt(0)) {
          params.category = selectedCategory;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts`, { params });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    
    fetchPosts();
  }, [selectedCategory, userInfo?.id]);

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
    router.push(`/mypage//posts/${postId}/show`);
  }, [router]);

	return (
		<div>
			<Head>
				<title>マイページ</title>
			</Head>
      <Header showButtonFlag={true} />
      <Box
        p={5}
        mt={111}
        shadow="md"
        borderWidth="1px"
        borderRadius="20px"
        width="1100px"
        mx="auto"
        bg="white"
      >
        <PageHeading title={"マイページ"} />
        <Text mt={7} fontSize="16px">
          作成済みの投稿を確認・編集することができます。<br />
          投稿のカテゴリーを選択できます。
        </Text>
        <Flex justifyContent="flex-start" mt={5} ml={1}>
          <CategoryDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleSelect}
          />
        </Flex>
        <SimpleGrid columns={3} mt={10} ml={10} rowGap={7}>
          {currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={handlePostClick}
              text={
                <Box
                  h={7}
                  w="fit-content"
                  px={2}
                  bg={
                    BigInt(post.category_id) === BigInt(1) ? 'blue.400' :
                    BigInt(post.category_id) === BigInt(2) ? 'teal.400' :
                    BigInt(post.category_id) === BigInt(3) ? 'green.400' :
                    BigInt(post.category_id) === BigInt(4) ? 'cyan.400' :
                    'gray.500'
                  }
                  color='white'
                  textAlign='center'
                  lineHeight='1.75'
                  borderRadius="20px"
                >
                  {categories.find(category => category.id === post.category_id)?.name || '未指定'}
                </Box>
              }
            />
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

export default MyPagePostIndex;