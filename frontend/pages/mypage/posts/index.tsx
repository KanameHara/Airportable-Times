//----------------------------------------------------------------
// マイページ投稿一覧画面
//----------------------------------------------------------------
import { useRouter } from 'next/router';
import { useAuth } from '../../../components/contexts/AuthContext';
import React, { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../../components/layouts/Header';
import { UserInfoType } from '@/types/UserInfoType';
import { fetchUserInfoByEmail } from '@/lib/mysql/api/database';
import { PostInfoType } from '@/types/PostInfoType';
import axios from 'axios';
import PostCard from '@/components/layouts/PostCard';
import Pagination from '@/components/layouts/Pagination';
import CategoryDropdown from '@/components/layouts/CategoryDropdown';
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
	
	// ユーザー投稿データのうち選択中のカテゴリーのものを取得
  const [posts, setPosts] = useState<PostInfoType[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts`, {
          params: {
            category: selectedCategory,
            user_id: userInfo?.id,
          },
        });
        setPosts(response.data);
      }
      catch (error){
        console.error('Error fetching posts:', error);
      }
    };

    if (selectedCategory && userInfo?.id) {
      fetchPosts();
    }
  }, [selectedCategory, userInfo?.id]);

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
    router.push(`/mypage/posts/${postId}/show`);
  }

	return (
		<div>
			<Head>
				<title>マイページ</title>
			</Head>
      <Header showButtonFlag={true} />
      <Box p={5} mt={10} shadow="md" borderWidth="1px" borderRadius="md" width="80%" mx="auto" bg="white">
        <h1 style={{ fontSize: '25px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px' }}>
          【{userInfo?.userName}さんマイページ】
        </h1>
        <Flex>
          <Text mt={5} ml={12} fontWeight="bold">ユーザー名：</Text>
          <Text mt={5} ml={2} fontWeight="bold">{userInfo?.userName}</Text>
        </Flex>
        <Flex>
          <Text mt={5} ml={12} fontWeight="bold">メールアドレス：</Text>
          <Text mt={5} ml={2} fontWeight="bold">{userInfo?.email}</Text>
        </Flex>
        <Flex>
          <Text mt={5} ml={12} fontWeight="bold">過去の投稿一覧：</Text>
        </Flex>
        <Text mt={5} ml={16} fontWeight="bold">投稿のカテゴリーを選択できます。</Text>
        <Flex justifyContent="flex-start" mt={5} ml={70}>
          <CategoryDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleSelect}
          />
        </Flex>
        <SimpleGrid columns={3} spacing={2} m={10}>
          {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={handlePostClick} />
          ))}
        </SimpleGrid>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </Box>
		</div>
	);
};

export default MyPagePostIndex;