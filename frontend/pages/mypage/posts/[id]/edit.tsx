//----------------------------------------------------------------
// マイページ投稿編集画面
//----------------------------------------------------------------
import React, { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head"; 
import Header from "@/components/layouts/Header";
import { useRouter } from 'next/router';
import MapforPost from "@/components/Features/GoogleMap/MapforPost";
import ImageUploadForm from "@/components/UI/ImageUploadForm";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from "@/components/contexts/AuthContext";
import { UserInfoType } from "@/types/UserInfoType";
import { fetchUserInfoByEmail } from "@/lib/mysql/api/database";
import { SelectedPhotoPositionType } from "@/types/SelectePhotoPositionType";
import { PostInfoType } from "@/types/PostInfoType";
import { Image } from "@chakra-ui/react";
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

export default function MyPagePostEdit() { 

  const router = useRouter();
  const { id: postID } = router.query;
  const [errMsgforImg, setErrMsgforImg] = useState<string | null>(null);
  const imageErrorRef = useRef<HTMLDivElement>(null);
  
  interface Category {
    id: bigint;
    name: string;
  }
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<bigint>(BigInt(1));
  const [post, setPost] = useState<PostInfoType | null>(null);
  const [airportName, setAirportName] = useState<string>('');
  const toast = useToast();

  type previewImageListType = {
    [key: number]: string | null;
  };
  const [previewImageList, setPreviewImageList] = useState<previewImageListType>({});

  const initialImageListState = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  };
  const [previousImageList, setPreviousImageList] = useState<previewImageListType>(initialImageListState);

  interface FormValues {
    title: string;
    date: string;  // 日付は YYYY-MM-DD 形式の文字列
    location: string;
    comment?: string;  // コメントはオプショナル
  }
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      date: '',
      location: '',
      comment: '',
    }
  });

  type selectedImageListType = {
    [key: number]: File | null;
  };
  const [selectedImageList, setSelectedImageList] = useState<selectedImageListType>(initialImageListState);
  const [selectedPosition, setSelectedPosition] = useState<SelectedPhotoPositionType>({
    latitude: null,
    longitude: null,
  });

  // 初回読み込み時にpostIDにもとづく投稿情報を取得
  useEffect(() => {
    const fetchPost = async () => {
      if (!postID) return;

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts`, {
          params: { id: postID }
        });

        const postData = response.data[0];
        postData.taking_position_latitude = parseFloat(postData.taking_position_latitude);
        postData.taking_position_longitude = parseFloat(postData.taking_position_longitude);
        setPost(postData);

        const placesResponse = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/places/show`, {
          params: { place_id: postData.airport_id }
        });
        setAirportName(placesResponse.data.result.name);

        const imageUrls = postData.image_urls;
        const previewImages: previewImageListType = { ...initialImageListState };

        imageUrls.forEach((url: string, index: number) => {
          const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}${url}`;
          previewImages[index + 1] = fullUrl;
        });
        
        setPreviousImageList(previewImages);
        setSelectedCategory(postData.category_id);
        setSelectedPosition({
          latitude: postData.taking_position_latitude,
          longitude: postData.taking_position_longitude,
        });

      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postID]);

  // 入力フォームの文字データを初期化
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        date: post.taking_at,
        location: post.location,
        comment: post.comment,
      });
    }
  }, [post, reset]);

  // カテゴリーデータの取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/categories`);
        setCategories(response.data);
        setSelectedCategory(response.data[0].id);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);
  
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  
  // ユーザー情報の取得
  useEffect(() => {
    const getUserInfo = async () => {
      const info = await fetchUserInfoByEmail(currentUser?.email);
      setUserInfo(info);
    };

    if (currentUser?.email) {
      getUserInfo();
    }
  }, [currentUser?.email]);

  const handleImageChange = useCallback((id: number, url: string | null, file: File | null) => {
    setPreviewImageList(prev => ({ ...prev, [id]: url }));
    setSelectedImageList(prev => ({ ...prev, [id]: file }));
  }, []);

  const handleSelect = useCallback((categoryId: bigint) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleCancelButtonClick = () => {
    router.push(`/mypage/posts`);
  }

  const handleSelectedPhotoPosition = useCallback((latitude: number, longitude: number) => {
    setSelectedPosition({ latitude, longitude });
  }, []);

  const handleDeletePreviousImage = (index: number) => {
    setPreviousImageList(prev => ({ ...prev, [index]: null }));
  }

  const onSubmit = useCallback(async (data: FormValues) => { 
    let isImagesSelected = true;
    let errorImageIndex = -1;

    if (!selectedImageList[1] && !previousImageList[1]) {
      isImagesSelected = false;
      errorImageIndex = 1;
    } else {
      for (let i = 3; i <= 5; i++) { 
        if (((selectedImageList[i]) && (!selectedImageList[i - 1] && !previousImageList[i - 1])) ||
            ((previousImageList[i]) && (!selectedImageList[i - 1] && !previousImageList[i - 1])))
        {
          isImagesSelected = false;
          errorImageIndex = i-1;
          break;
        }
      }
    }

    if (!isImagesSelected) {
      setErrMsgforImg(`${errorImageIndex}番目以前の画像を選択しているか確認してください。`);
      if (imageErrorRef.current) {
        imageErrorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    } else {
      setErrMsgforImg(null);
    }

    const formData = new FormData();
    formData.append('post[user_id]', userInfo?.id.toString() || '');
    formData.append('post[airport_id]', post?.airport_id.toString() || '');
    formData.append('post[category_id]', selectedCategory.toString());
    formData.append('post[title]', data.title);
    formData.append('post[taking_at]', data.date);
    formData.append('post[location]', data.location);
    if (selectedPosition.latitude && selectedPosition.longitude) {
      formData.append('post[taking_position_latitude]', selectedPosition.latitude.toString());
      formData.append('post[taking_position_longitude]', selectedPosition.longitude.toString());
    }
    formData.append('post[comment]', data.comment || '');
    Object.entries(selectedImageList).forEach(([key, file], index) => {
      if (file !== null) {
        formData.append(`images[${index}]`, file as Blob);
      } else {
        formData.append(`images[${index}]`, new Blob([]));
      }
    });
    Object.entries(previousImageList).forEach(([key, url], index) => {
      formData.append(`previous_images[${index}]`, url !== null ? url : "");
    });
    
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_RAILS_SERVER_URL_DEV}/posts/${postID}`, formData);
      
      toast({
        title: '編集が完了しました。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push(`/mypage/posts`);

    } catch (error) {
      console.error('axios.postのエラー内容', error);

      toast({
        title: '編集に失敗しました。',
        description: "再度お試しください。",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [selectedImageList, previousImageList, selectedCategory, userInfo, selectedPosition, postID, post, router]);

  return (
    <div>
      <Head>
        <title>投稿編集</title>
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
        <PageHeading title={`${airportName} 投稿編集`} />
        <Flex mt={5} ml={1}>
          <Text color='red.500'>*</Text>
          <Text>は必須項目です。</Text>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <Text ml={selectedImageList[index + 1] ? 10 : 205}>変更前の画像{index+1}</Text>
                {previousImageList[index + 1] ? (
                  <Image
                    src={previousImageList[index + 1] || undefined}
                    alt={`Previous image ${index + 1}`}
                    width={20}
                    height={10}
                    objectFit="cover"
                    ml={4}
                  />
                ) : (
                    <Box
                      ml={4}
                      h={7}
                      w={20}
                      bg='gray.500'
                      color='white'
                      textAlign='center'
                      fontWeight='bold'
                      borderRadius="5px"
                    >
                      未選択
                    </Box>
                )}
                {previousImageList[index + 1] && (
                  <Button
                    h={7}
                    ml={2}
                    bg='red.100'
                    onClick={() => handleDeletePreviousImage(index + 1)}
                  >
                    削除
                  </Button>
                )}
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
          <MapforPost onSelectedPhotoPosition={handleSelectedPhotoPosition} selectedPhotoPosition={selectedPosition} />

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
            <Button type="submit" ml={500} bg='blue.400' color='white'>編集を完了</Button>
          </Box>
        </form>
      </Box>
      <Footer />
    </div>
  )
}