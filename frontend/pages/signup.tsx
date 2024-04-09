import Head from "next/head";
import Header from "@/components/layouts/Header";
import React, { FC } from 'react';
import { Flex, Button, Text, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Signup: FC = () => {

	// ページ切り替えのためのrouter
	const router = useRouter();

	// キャンセルボタンのハンドラ
	const handleCancelButtonlClick = () => {
		router.push('/signin');
	};

	return (
		<div>
			<Head>
				<title>新規登録</title>
			</Head>
			<Header userName="userName" showButtonFlag={false} />
			<Text mt={100} ml={600}>Airportable Timesにようこそ！</Text>
			<Flex>
				<Text mt={50} ml={550} mr={8}>メールアドレス</Text>
				<Input mt={50} ml={10} w="300px" h="30px" placeholder="sample123@gmail.com" />
			</Flex>
			<Flex>
				<Text mt={10} ml={550} mr={16}>ユーザー名</Text>
				<Input mt={10} ml={10} w="300px" h="30px" />
			</Flex>
			<Flex>
				<Text mt={10} ml={550} mr={16}>パスワード</Text>
				<Input mt={10} ml={10} w="300px" h="30px" />
			</Flex>
			<Flex>
				<Text mt={10} ml={550} mr={1}>パスワード(確認用)</Text>
				<Input mt={10} ml={10} w="300px" h="30px" />
			</Flex>
			<Flex>
				<Button w={200} mt={70} ml={500} colorScheme="blue">新規登録</Button>
				<Button w={200} mt={70} ml={10} colorScheme="blue" onClick={handleCancelButtonlClick}>キャンセル</Button>
			</Flex>
		</div>
	);
}

export default Signup;