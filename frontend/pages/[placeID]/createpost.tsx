//----------------------------------------------------------------
// 各空港投稿作成画面
//----------------------------------------------------------------
import { useState } from "react";
import Head from "next/head"; 
import Header from "../../components/layouts/Header";
import { useRouter } from 'next/router';
import MapforPost from "@/components/layouts/MapforPost";
import ImageUploadForm from "@/components/layouts/ImageUploadForm";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useMap } from '../../components/contexts/MapContext';
import { useForm } from 'react-hook-form';
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

	// 投稿種別の初期化
	const [selectedCategory, setSelectedCategory] = useState('航空機・風景');
	// 投稿種別選択時のハンドラ
  const handleSelect = (category: string) => {
    setSelectedCategory(category);
	}

	// 入力フォームのバリデーション
	const { register, handleSubmit, formState: { errors } } = useForm();

	// ImageUploadForm（1~5番目すべて）のデータを管理するオブジェクト
	type ImageListType = {
		[key: number]: string | null;
	};
	const [imageList, setImageList] = useState<ImageListType>({});

	// 画像選択時のハンドラ
	const handleImageChange = (id: number, url: string | null) => {
    setImageList(prev => ({ ...prev, [id]: url }));
	};
	
	// 投稿作成キャンセルボタン押下時のハンドラ
	const handleCancelButtonClick = () => {
		// 各空港投稿一覧に戻る
		router.push(`/${placeID}/postlist`);
	}

	// 投稿ボタン押下時のハンドラ
	const onSubmit = () => { 

		// 投稿写真の選択状態を取得
		let isImagesSelected = false;
		for (let i = 1; i <= 5; i++) { 
			if (imageList[i]) {
        isImagesSelected = true;
        break;
      }
		}
		// 画像未選択時にはエラー表示
		if (!isImagesSelected) {
			setErrMsgforImg('少なくとも１つの画像を選択してください。');
			return;
		}
		else {
			setErrMsgforImg(null);
		}
	}

	return (
		<div>
			<Head>
				<title>{selectedPlaceInfo.selectedPlace?.name}投稿作成</title>
      </Head>
			<Header showButtonFlag={true} />

			<form onSubmit={handleSubmit(onSubmit)}>
				<Text mt={50} ml={10} mb={5} fontWeight="bold">ステップ１&nbsp;&nbsp;投稿する写真を5枚まで選択してください。</Text>
				<Box ml={70} position="relative" zIndex="0" p={5} bgColor="#E2E8F0" w="50%" h="550px">
          <Box position="absolute" top="0" left="0" right="0" bottom="10" display="flex" flexDirection="column" justifyContent="space-between" p={4} zIndex="1">
						<Text fontWeight="bold" color='red'>{errMsgforImg}</Text>
						<ImageUploadForm id={1} onImageChange={handleImageChange} />
            <ImageUploadForm id={2} onImageChange={handleImageChange} />
            <ImageUploadForm id={3} onImageChange={handleImageChange} />
            <ImageUploadForm id={4} onImageChange={handleImageChange} />
            <ImageUploadForm id={5} onImageChange={handleImageChange} />
					</Box>
				</Box>
  
				<Text mt={20} ml={10} fontWeight="bold">ステップ２&nbsp;&nbsp;投稿のカテゴリーを選択してください。</Text>
				<Flex>
					<Menu>
						<MenuButton as={Button} mt={5} ml={70} rightIcon={<ChevronDownIcon />}>
							{`${selectedCategory}`}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleSelect('航空機・風景')}>航空機・風景</MenuItem>
              <MenuItem onClick={() => handleSelect('グルメ・お土産')}>グルメ・お土産</MenuItem>
              <MenuItem onClick={() => handleSelect('アクティビティ・イベント')}>アクティビティ・イベント</MenuItem>
              <MenuItem onClick={() => handleSelect('その他')}>その他</MenuItem>
            </MenuList>
					</Menu>
				</Flex>
  
				<Text ml={10} mt={20} fontWeight="bold">ステップ３&nbsp;&nbsp;投稿する各情報を入力してください。</Text>
				<Flex>
					<FormControl isInvalid={Boolean(errors.title)}>
						<FormLabel htmlFor='title' textAlign='start' mt={5} ml={70}>
							投稿のタイトル
            </FormLabel>
						<Input placeholder="入力必須" w="400px" h="30px" ml={70}
							{...register('title', {
								required: 'タイトルは必須です',
								maxLength: {
									value: 30,
									message: '30文字以内で入力してください',
								}
							})}
						/>
						<FormErrorMessage ml={70}>
							{errors.title && typeof errors.title.message === 'string' ? errors.title.message : ''}
						</FormErrorMessage>
					</FormControl>
				</Flex>

				<Flex>
					<FormControl isInvalid={Boolean(errors.date)}>
						<FormLabel htmlFor='date' mt={5} ml={70}>
							撮影日
            </FormLabel>
						<Input type="date" w="200px" h="30px" ml={70}
							{...register('date', { required: '撮影日は必須です' })}
						/>
						<FormErrorMessage ml={70}>
							{errors.date && typeof errors.date.message === 'string' ? errors.date.message : ''}
						</FormErrorMessage>
					</FormControl>
				</Flex>

				<Flex>
					<FormControl isInvalid={Boolean(errors.location)}>
						<FormLabel htmlFor='location' mt={5} ml={70}>
							撮影場所名
            </FormLabel>
						<Input placeholder="入力必須" w="400px" h="30px" ml={70}
							{...register('location', {
								required: '撮影場所は必須です',
								maxLength: {
									value: 30,
									message: '30文字以内で入力してください',
								}
							})}
						/>
						<FormErrorMessage ml={70}>
							{errors.location && typeof errors.location.message === 'string' ? errors.location.message : ''}
						</FormErrorMessage>
					</FormControl>

				</Flex>
				<Text mt={10} ml={70} mb={5}>撮影場所を地図上でクリックまたは検索してください。</Text>
				<MapforPost />

				<FormControl isInvalid={Boolean(errors.comment)}>
					<FormLabel htmlFor='comment' mt={5} ml={70}>
						コメント
					</FormLabel>
					<Textarea w="600px" h="100px" ml={70}
						{...register('comment', {
							maxLength: {
								value: 1000,
								message: '1000文字以内で入力してください',
							}
						})}
					/>
					<FormErrorMessage ml={70}>
						{errors.comment && typeof errors.comment.message === 'string' ? errors.comment.message : ''}
					</FormErrorMessage>
				</FormControl>

				<Flex>
					<Button type="submit" w={40} ml={460} mt={50} bg='blue.400' color='white'>投稿</Button>
					<Button w={40} ml={5} mt={50} mb={100} bg='blue.400' color='white' onClick={handleCancelButtonClick}>キャンセル</Button>
				</Flex>
			</form>
		</div>
	)
}