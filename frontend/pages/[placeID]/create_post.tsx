//----------------------------------------------------------------
// 各空港投稿作成画面
//----------------------------------------------------------------
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head"; 
import Header from "../../components/layouts/Header";
import { useRouter } from 'next/router';
import MapforPost from "@/components/layouts/MapforPost";
import ImageUploadForm from "@/components/layouts/ImageUploadForm";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useMap } from '../../components/contexts/MapContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from "@/components/contexts/AuthContext";
import { UserInfoType } from "@/types/UserInfoType";
import { fetchUserInfoByEmail } from "@/lib/mysql/api/database";
import { SelectedPhotoPositionType } from "@/types/SelectePhotoPositionType";
import {
  Text,
  Flex,
  Button,
  Input,
  Textarea,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

export default function CreatePost() { 

  // URLからplaceIDを取得
  const router = useRouter();
  const { placeID } = router.query;

  // 選択空港の情報を取得
  const { selectedPlaceInfo } = useMap();

  // 画像未選択時のエラーメッセージ
  const [errMsgforImg, setErrMsgforImg] = useState<string | null>();

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

  // 入力フォームのバリデーション
  interface FormValues {
    title: string;
    date: string;  // 日付は YYYY-MM-DD 形式の文字列
    location: string;
    comment?: string;  // コメントはオプショナル
  }
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  // ImageUploadForm（1~5番目すべて）のプレビュー画像のURLリスト
  type previewImageListType = {
    [key: number]: string | null;
  };
  const [previewImageList, setPreviewImageList] = useState<previewImageListType>({});

  // ImageUploadForm（1~5番目すべて）の画像ファイルリスト
  type selectedImageListType = {
    [key: number]: File | null;
  };
  const [selectedImageList, setSelectedImageList] = useState<selectedImageListType>({});

  // マップで選択する撮影位置情報を初期化(初期値は選択中の空港の位置)
  const [selectedPosition, setSelectedPosition] = useState<SelectedPhotoPositionType>({
    latitude: selectedPlaceInfo.center.lat,
    longitude: selectedPlaceInfo.center.lng,
  });

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
  
  // // ログイン中ユーザーのIDを取得
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  
  useEffect(() => {
    const getUserInfo = async () => {
      // メールアドレスからIDを検索する
      const info = await fetchUserInfoByEmail(currentUser?.email);
      setUserInfo(info);
    };

    if (currentUser?.email) {
      getUserInfo();
    }
  }, [currentUser?.email]);  // currentUser.email が変更されたときに再実行

  // 画像選択時のハンドラ
  const handleImageChange = useCallback((id: number, url: string | null, file: File | null) => {
    // プレビュー画像を設定
    setPreviewImageList(prev => ({ ...prev, [id]: url }));

    // 画像ファイルを設定
    setSelectedImageList(prev => ({ ...prev, [id]: file }));
  }, []);
  
  // 投稿作成キャンセルボタン押下時のハンドラ
  const handleCancelButtonClick = () => {
    // 各空港投稿一覧に戻る
    router.push(`/${placeID}/post_list`);
  }

  // マップで撮影位置選択時のハンドラ
  const handleSelectedPhotoPosition = (longitude: number, latitude: number) => {
    setSelectedPosition({ longitude, latitude });
  };

  // 投稿ボタン押下時のハンドラ
  const onSubmit = async (data: FormValues) => { 
    // 投稿写真の選択状態を取得
    let isImagesSelected = false;
    for (let i = 1; i <= 5; i++) { 
      if (selectedImageList[i]) {
        isImagesSelected = true;
        break;
      }
    }

    // 画像未選択時にはエラー表示
    if (!isImagesSelected) {
      setErrMsgforImg('少なくとも１つの画像を選択してください。');
      return;
    } else {
      setErrMsgforImg(null);
    }

    // postsテーブルに登録する情報
    const formData = new FormData();
    formData.append('post[user_id]', userInfo?.id.toString() || '');
    formData.append('post[airport_id]', selectedPlaceInfo.selectedPlace?.place_id?.toString() || '');
    formData.append('post[category_id]', selectedCategory.toString());
    formData.append('post[title]', data.title);
    formData.append('post[taking_at]', data.date);
    formData.append('post[location]', data.location);
    formData.append('post[taking_position_latitude]', selectedPosition.latitude.toString());
    formData.append('post[taking_position_longitude]', selectedPosition.longitude.toString());
    formData.append('post[comment]', data.comment || '');
  
    // post_imagesテーブルに登録する情報
    // 具体的にはObject.values()でselectedImageListの値を配列に変換し、
    // .filter以降の処理でfileがnullでないものだけを抽出している
    Object.values(selectedImageList).filter((file) => file !== null).forEach((file, index) => {
      formData.append(`images[${index}]`, file as Blob);
    });

    // //投稿情報をDBに登録
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts`, formData);

      // レスポンスから画像のURLを取得してコンソールに表示
      const imageUrls = response.data.image_urls;
        
      // ベースURLを環境変数から取得
      const baseURL = process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV;

      // 完全なURLに変換
      const fullImageUrls = imageUrls.map((url: string) => `${baseURL}${url}`);
      console.log('投稿された画像の完全なURL:', fullImageUrls);
      
      // 登録成功なら各空港投稿一覧に戻る
      router.push(`/${placeID}/post_list`);

    } catch (error) {
      console.error('axios.postのエラー内容', error);
    }
  }

  return (
    <div>
      <Head>
        <title>{selectedPlaceInfo.selectedPlace?.name}投稿作成</title>
      </Head>
      <Header showButtonFlag={true} />
      <Box p={5} mt={10} shadow="md" borderWidth="1px" borderRadius="md" width="55%" mx="auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text mt={50} mb={5} fontWeight="bold">ステップ１&nbsp;&nbsp;投稿する写真を5枚まで選択してください。</Text>
          <Box position="relative" zIndex="0" p={5} bgColor="#E2E8F0" h="550px">
            <Box position="absolute" top="0" left="0" right="0" bottom="10" display="flex" flexDirection="column" justifyContent="space-between" p={4} zIndex="1">
              <Text fontWeight="bold" color='red'>{errMsgforImg}</Text>
              <ImageUploadForm id={1} onImageChange={handleImageChange} />
              <ImageUploadForm id={2} onImageChange={handleImageChange} />
              <ImageUploadForm id={3} onImageChange={handleImageChange} />
              <ImageUploadForm id={4} onImageChange={handleImageChange} />
              <ImageUploadForm id={5} onImageChange={handleImageChange} />
            </Box>
          </Box>
  
          <Text mt={20} fontWeight="bold">ステップ２&nbsp;&nbsp;投稿のカテゴリーを選択してください。</Text>
          <Flex>
            <Menu>
              <MenuButton as={Button} mt={5} rightIcon={<ChevronDownIcon />}>
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
  
          <Text mt={20} fontWeight="bold">ステップ３&nbsp;&nbsp;投稿する各情報を入力してください。</Text>
          <Flex>
            <FormControl isInvalid={Boolean(errors.title)}>
              <FormLabel htmlFor='title' textAlign='start' mt={5}>
                投稿のタイトル
              </FormLabel>
              <Input placeholder="入力必須" w="400px" h="30px"
                {...register('title', {
                  required: 'タイトルは必須です',
                  maxLength: {
                    value: 30,
                    message: '30文字以内で入力してください',
                  }
                })}
              />
              <FormErrorMessage>
                {errors.title && typeof errors.title.message === 'string' ? errors.title.message : ''}
              </FormErrorMessage>
            </FormControl>
          </Flex>

          <Flex>
            <FormControl isInvalid={Boolean(errors.date)}>
              <FormLabel htmlFor='date' mt={5}>
                撮影日
              </FormLabel>
              <Input type="date" w="200px" h="30px"
                {...register('date', { required: '撮影日は必須です' })}
              />
              <FormErrorMessage>
                {errors.date && typeof errors.date.message === 'string' ? errors.date.message : ''}
              </FormErrorMessage>
            </FormControl>
          </Flex>

          <Flex>
            <FormControl isInvalid={Boolean(errors.location)}>
              <FormLabel htmlFor='location' mt={5}>
                撮影場所名
              </FormLabel>
              <Input placeholder="入力必須" w="400px" h="30px"
                {...register('location', {
                  required: '撮影場所は必須です',
                  maxLength: {
                    value: 30,
                    message: '30文字以内で入力してください',
                  }
                })}
              />
              <FormErrorMessage>
                {errors.location && typeof errors.location.message === 'string' ? errors.location.message : ''}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Text mt={10} mb={5}>撮影場所を地図上でクリックまたは検索してください。</Text>
          <MapforPost onSelectedPhotoPosition={handleSelectedPhotoPosition} />

          <FormControl isInvalid={Boolean(errors.comment)}>
            <FormLabel htmlFor='comment' mt={5}>
              コメント
            </FormLabel>
            <Textarea w="700px" h="100px"
              {...register('comment', {
                maxLength: {
                  value: 1000,
                  message: '1000文字以内で入力してください',
                }
              })}
            />
            <FormErrorMessage>
              {errors.comment && typeof errors.comment.message === 'string' ? errors.comment.message : ''}
            </FormErrorMessage>
          </FormControl>

          <Flex justifyContent="center" mt={10}>
						<Button type="submit" w={40} ml={80} bg='blue.400' color='white'>投稿</Button>
            <Button w={40} ml={5} bg='blue.400' color='white' onClick={handleCancelButtonClick}>キャンセル</Button>
          </Flex>
        </form>
      </Box>
    </div>
  )
}