//----------------------------------------------------------------
// 新規ユーザー登録ページ
//----------------------------------------------------------------
'use client'
import NextLink from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react'

import Head from "next/head";
import Header from "@/components/layouts/Header";
import { signUpWithEmail } from '@/lib/firebase/api/auth'
import { useRouter } from 'next/router';

// フォームで使用する変数の型を定義
type formInputs = {
  email: string
  password: string
	confirm: string
	username: string;
}

/** サインアップ画面
 * @screenname SignUpScreen
 * @description ユーザの新規登録を行う画面
 */
export default function SignUpScreen() {

  const { handleSubmit, register } = useForm<formInputs>()
  const [password, setPassword] = useState(false)
	const [confirm, setConfirm] = useState(false)
	const router = useRouter();

	const onSubmit = handleSubmit(async (data) => {
		signUpWithEmail({ email: data.email, password: data.password }).then(
      (res: boolean) => {
        if (res) {
					console.log('新規登録成功')
					router.push('/home'); // ログイン後にホーム画面に遷移
        } else {
					console.log('新規登録失敗')
					alert('新規登録に失敗しました')
        }
      }
    )
	})

  const passwordClick = () => setPassword(!password)
  const confirmClick = () => setConfirm(!confirm)

  return (
		<div>
			<Head>
				<title>新規登録</title>
			</Head>
			<Header userName="userName" showButtonFlag={false} />
			<Flex height='80vh' justifyContent='center' alignItems='center'>
        <VStack spacing='10'>
          <Heading>Airportable Timesにようこそ！</Heading>
          <form onSubmit={onSubmit}>
            <VStack alignItems='left'>
              <FormControl>
                <FormLabel htmlFor='email' textAlign='start'>
                  メールアドレス
                </FormLabel>
                <Input id='email' {...register('email')} />
							</FormControl>
							
							<FormControl>
                <FormLabel htmlFor='username'>ユーザー名</FormLabel>
                <Input id='username' {...register('username')} />
              </FormControl>
  
              <FormControl>
                <FormLabel htmlFor='password'>パスワード</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={password ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={passwordClick}>
                      {password ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
  
              <FormControl>
                <FormLabel htmlFor='confirm'>パスワード確認</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={confirm ? 'text' : 'password'}
                    {...register('confirm')}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={confirmClick}>
                      {confirm ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
  
              <Button
                marginTop='4'
                color='white'
                bg='blue.400'
                type='submit'
                paddingX='auto'
              >
                新規登録
              </Button>
            </VStack>
          </form>
          <Button as={NextLink} href='/signin' bg='white' width='100%'>
            ログインはこちらから
          </Button>
        </VStack>
      </Flex>
		</div>
  )
}