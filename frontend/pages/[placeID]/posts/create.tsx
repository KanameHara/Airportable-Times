//----------------------------------------------------------------
// 各空港投稿作成画面
//----------------------------------------------------------------
import React, { useState, useEffect, useCallback ,useRef } from "react";
import Head from "next/head"; 
import Header from "@/components/layouts/Header";
import { useRouter } from 'next/router';
import MapforPost from "@/components/Features/GoogleMap/MapforPost";
import ImageUploadForm from "@/components/UI/ImageUploadForm";
import { useMap } from "@/components/contexts/MapContext";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from "@/components/contexts/AuthContext";
import { UserInfoType } from "@/types/UserInfoType";
import { fetchUserInfoByEmail } from "@/lib/mysql/api/database";
import { SelectedPhotoPositionType } from "@/types/SelectePhotoPositionType";
import CategoryDropdown from "@/components/UI/CategoryDropdown";
import Footer from "@/components/layouts/Footer";
import PageHeading from "@/components/UI/PageHeading";
import HighlightedText from "@/components/UI/HighlightedText";
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
  useToast,
} from '@chakra-ui/react';

export default function AirportPostCreate() { 

  // URLからplaceIDを取得
  const router = useRouter();
  const { placeID } = router.query;

  // 選択空港の情報を取得
  const { selectedPlaceInfo } = useMap();

  const toast = useToast();

  // 画像未選択時のエラーメッセージ
  const [errMsgforImg, setErrMsgforImg] = useState<string | null>();
  const imageErrorRef = useRef<HTMLDivElement>(null);

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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL}/categories`);
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

    router.push(`/${placeID}`);
  }

  const handleSelectedPhotoPosition = useCallback((latitude: number, longitude: number) => {
    setSelectedPosition({ latitude, longitude });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };  

  // 投稿ボタン押下時のハンドラ
  const onSubmit = useCallback(async (data: FormValues) => {
    
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
      if (imageErrorRef.current) {
        imageErrorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
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
    if (selectedPosition.latitude && selectedPosition.longitude) {
      formData.append('post[taking_position_latitude]', selectedPosition.latitude.toString());
      formData.append('post[taking_position_longitude]', selectedPosition.longitude.toString());
    }
    formData.append('post[comment]', data.comment || '');
  
    // post_imagesテーブルに登録する情報
    // 具体的にはObject.values()でselectedImageListの値を配列に変換し、
    // .filter以降の処理でfileがnullでないものだけを抽出している
    Object.values(selectedImageList).filter((file) => file !== null).forEach((file, index) => {
      formData.append(`images[${index}]`, file as Blob);
    });

    // //投稿情報をDBに登録
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL}/posts`, formData);

      // レスポンスから画像のURLを取得してコンソールに表示
      const imageUrls = response.data.image_urls;
        
      // ベースURLを環境変数から取得
      const baseURL = process.env.NEXT_PUBLIC_RAILS_SERVER_URL;

      // 完全なURLに変換
      const fullImageUrls = imageUrls.map((url: string) => `${baseURL}${url}`);
      console.log('投稿された画像の完全なURL:', fullImageUrls);

      toast({
        title: '投稿が完了しました。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // 登録成功なら各空港投稿一覧に戻る
      router.push(`/${placeID}/posts`);

    } catch (error) {
      console.error('axios.postのエラー内容', error);

      toast({
        title: '投稿に失敗しました。',
        description: "再度お試しください。",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [userInfo, selectedPlaceInfo, selectedCategory, selectedImageList, selectedPosition, router, placeID]);

  return (
    <div>
      <Head>
        <title>{selectedPlaceInfo.selectedPlace?.name}投稿作成</title>
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
        <PageHeading title={`${selectedPlaceInfo.selectedPlace?.name} 投稿作成`} />
        <Flex mt={5} ml={1}>
          <Text color='red.500'>*</Text>
          <Text>は必須項目です。</Text>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
          <Box mt={5} position="relative">
            <HighlightedText text={"写真選択"} />
            <Box 
              position="absolute"
              top="10px"
              left="80px"
              bg="rgba(255, 255, 255, 0)"
              zIndex={1}
            >
              <Text color="red.500">*</Text>
            </Box>
          </Box>
          <Text ml={1}>{"5枚まで選択することができます。"}</Text>
          <Box ml={5} mt={10} ref={imageErrorRef} scrollMarginTop="70px">
            <Text fontWeight="bold" color='red'>{errMsgforImg}</Text>
            {Array.from({ length: 5 }, (_, index) => (
              <Flex key={index + 1} mb={70} alignItems="center">
                <ImageUploadForm
                  id={index + 1}
                  onImageChange={handleImageChange}
                />
              </Flex>
            ))}
          </Box>
  
          <Box mt={5} position="relative">
            <HighlightedText text={"投稿のカテゴリー選択"} />
            <Box 
              position="absolute"
              top="10px"
              left="188px"
              bg="rgba(255, 255, 255, 0)"
              zIndex={1}
            >
              <Text color="red.500">*</Text>
            </Box>
          </Box>
          <Flex justifyContent="flex-start" mt={2}>
            <CategoryDropdown
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleSelect}
            />
          </Flex>
  
          <Flex>
            <FormControl isInvalid={Boolean(errors.title)}>
              <FormLabel htmlFor='title' textAlign='start' mt={5}>
                <Box mt={5} position="relative">
                  <HighlightedText text={"タイトル"} />
                  <Box 
                    position="absolute"
                    top="10px"
                    left="80px"
                    bg="rgba(255, 255, 255, 0)"
                    zIndex={1}
                  >
                    <Text color="red.500">*</Text>
                  </Box>
                </Box>
              </FormLabel>
              <Input w="400px" h="30px"
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
                <Box mt={5} position="relative">
                  <HighlightedText text={"撮影日"} />
                  <Box 
                    position="absolute"
                    top="10px"
                    left="62px"
                    bg="rgba(255, 255, 255, 0)"
                    zIndex={1}
                  >
                    <Text color="red.500">*</Text>
                  </Box>
                </Box>
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
                <Box mt={5} position="relative">
                  <HighlightedText text={"撮影した場所"} />
                  <Box 
                    position="absolute"
                    top="10px"
                    left="118px"
                    bg="rgba(255, 255, 255, 0)"
                    zIndex={1}
                  >
                    <Text color="red.500">*</Text>
                  </Box>
                </Box>
              </FormLabel>
              <Input placeholder="例）第１展望台" w="400px" h="30px"
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
          <Text ml={1} mt={7} mb={2}>{"撮影した場所を地図上でクリックまたは検索してください。"}</Text>
          <Box>
            <MapforPost
              onSelectedPhotoPosition={handleSelectedPhotoPosition}
              selectedPhotoPosition={selectedPosition}
            />
          </Box>

          <FormControl isInvalid={Boolean(errors.comment)}>
            <FormLabel htmlFor='comment' mt={5}>
              <Box mt={5}>
                <HighlightedText text={"コメント"}  />
              </Box>
            </FormLabel>
            <Textarea w="700px" h="100px" placeholder="自由に記載してください。"
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

          <Box mt={10} mb={5}>
            <Button ml={5} onClick={handleCancelButtonClick}>戻る</Button>
            <Button type="submit" ml={500} bg='blue.400' color='white'>投稿する</Button>
          </Box>
        </form>
      </Box>
      <Footer />
    </div>
  )
}