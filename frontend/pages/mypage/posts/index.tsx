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
import { ChevronDownIcon } from '@chakra-ui/icons';
import { PostInfoType } from '@/types/PostInfoType';
import axios from 'axios';
import {
  Button,
  Flex,
  Box,
  Text,
  Image,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
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
	
	// ユーザーの投稿データを取得
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

	// 未実装のためコメントアウト -->
	// ユーザー投稿データのうち選択中のカテゴリーのものを取得
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts`, {
  //         params: {
  //           category: selectedCategory,
  //           user_id: userInfo?.id,
  //         },
  //       });
  //       setPosts(response.data);
  //     }
  //     catch (error){
  //       console.error('Error fetching posts:', error);
  //     }
  //   };

  //   if (selectedCategory && userInfo?.id) {
  //     fetchPosts();
  //   }
  // }, [selectedCategory, userInfo?.id]);
  // 未実装のためコメントアウト <--

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
      </Box>
		</div>
	);
};

export default MyPagePostIndex;