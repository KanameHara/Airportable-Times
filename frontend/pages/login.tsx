import Head from "next/head";
import Header from "@/components/layouts/Header";
import React, { FC } from 'react';
import { Flex, Button, Text, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Login: FC = () => {

	// ページ切り替えのためのrouter
  const router = useRouter();

	// 「新規登録はこちら」ボタンのハンドラ
	const handleRegisterButtonClick = () => {
		router.push('/createAccount');
	};

	return (
		<div>
			<Head>
				<title>ログイン</title>
			</Head>
			<Header userName="userName" showButtonFlag={false} />
			<Text mt={100} ml={600}>Airportable Timesにログイン</Text>
			<Flex>
				<Text mt={50} ml={550}>メールアドレス</Text>
				<Input mt={50} ml={10} w="300px" h="30px" placeholder="sample123@gmail.com" />
			</Flex>
			<Flex>
				<Text mt={10} ml={550} mr={8}>パスワード</Text>
				<Input mt={10} ml={10} w="300px" h="30px" />
			</Flex>
			<Button w={200} mt={70} ml={600} colorScheme="blue">ログイン</Button>
			<Button w={200} mt={6} ml={600} color="blue.500" bg="transparent"
				_hover={{ bg: "transparent", textDecoration: "underline" }}
				onClick={handleRegisterButtonClick}
			>
				新規登録はこちら
			</Button>
		</div>
	);
}

export default Login;