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
	FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
	InputRightElement,
	useToast,
  VStack,
} from '@chakra-ui/react'

import Head from "next/head";
import Header from "@/components/layouts/Header";
import { signUpWithEmail } from '@/lib/firebase/api/auth'
import { useRouter } from 'next/router';
import { FirebaseResult } from '@/lib/firebase/api/auth'

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

	// 入力フォームのデータ管理　
	const {
		handleSubmit,
		register,		// registerで要入力のフォームを登録
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<formInputs>()
	
	// パスワードの表示/非表示管理
	const [password, setPassword] = useState(false)
	
	// パスワード(確認用)の表示/非表示管理
	const [confirm, setConfirm] = useState(false)

	const router = useRouter();

	const toast = useToast();

	// 新規登録ボタンハンドラ
	// signUpWithEmailはfirebaseの応答を待つためhandleSubmitは非同期処理となっている
	// thenメソッドでログイン成功/失敗時の結果をresに格納
	const onSubmit = handleSubmit(async (data) => {
		await signUpWithEmail({
			email: data.email,
			password: data.password,
		}).then((res: FirebaseResult) => {
			if (res.isSuccess) {
				toast({
					title: res.message,
					status: 'success',
					duration: 2000,
					isClosable: true,
				})
				router.push('/home'); // 新規登録後にホーム画面に遷移
			} else {
					toast({
						title: res.message, 
						status: 'error',
						duration: 2000,
						isClosable: true,
					})
			}
		})
	})

	// パスワード表示/非表示状態管理
  const passwordClick = () => setPassword(!password)
  const confirmClick = () => setConfirm(!confirm)

  return (
		<div>
			<Head>
				<title>新規登録</title>
			</Head>
			<Header userName="userName" showButtonFlag={false} />
			<Flex height='100vh' justifyContent='center' alignItems='center'>
        <VStack spacing='10'>
          <Heading>Airportable Timesにようこそ！</Heading>
          <form onSubmit={onSubmit}>
            <VStack alignItems='left'>
							<FormControl isInvalid={Boolean(errors.email)}>
                <FormLabel htmlFor='email' textAlign='start'>
                  メールアドレス
                </FormLabel>
                <Input
                  id='email'
                  {...register('email', {
                    required: '必須項目です',
                    maxLength: {
                      value: 50,
                      message: '50文字以内で入力してください',
                    },
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@+[a-zA-Z0-9-]+\.+[a-zA-Z0-9-]+$/,
                      message: 'メールアドレスの形式が違います',
                    },
                  })}
								/>
								<FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
							</FormControl>
							
							<FormControl isInvalid={Boolean(errors.username)}>
                <FormLabel htmlFor='username'>ユーザー名</FormLabel>
								<Input id='username' {...register('username', {
									required: '必須項目です',
									minLength: {
										value: 2,
										message: '2文字以上で入力してください',
									},
                  maxLength: {
                    value: 10,
                    message: '10文字以内で入力してください',
									},
									pattern: {
										value: /^[a-zA-Z0-9_-]+$/,
										message: '使用できる文字はアルファベット、数字、ハイフン(-)、アンダースコア(_)のみです',
									}
								})} />
								<FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
  
              <FormControl isInvalid={Boolean(errors.password)}>
                <FormLabel htmlFor='password'>パスワード</FormLabel>
								<InputGroup size='md'>
									<Input
                    pr='4.5rem'
                    type={password ? 'text' : 'password'}
                    {...register('password', {
                      required: '必須項目です',
                      minLength: {
                        value: 8,
                        message: '8文字以上で入力してください',
                      },
                      maxLength: {
                        value: 50,
                        message: '50文字以内で入力してください',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])[0-9a-zA-Z]*$/,
                        message:
                          '半角英数字かつ少なくとも1つの大文字を含めてください',
                      },
                    })}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={passwordClick}>
                      {password ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
  
              <FormControl isInvalid={Boolean(errors.confirm)}>
                <FormLabel htmlFor='confirm'>パスワード確認</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={confirm ? 'text' : 'password'}
                    {...register('confirm', {
                      required: '必須項目です',
                      minLength: {
                        value: 8,
                        message: '8文字以上で入力してください',
                      },
                      maxLength: {
                        value: 50,
                        message: '50文字以内で入力してください',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])[0-9a-zA-Z]*$/,
                        message:
                          '半角英数字かつ少なくとも1つの大文字を含めてください',
                      },
                      validate: (value) =>
                        value === getValues('password') ||
                        'パスワードが一致しません',
                    })}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={confirmClick}>
                      {confirm ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.confirm && errors.confirm.message}
                </FormErrorMessage>
              </FormControl>
  
              <Button
                marginTop='4'
                color='white'
                bg='blue.400'
                isLoading={isSubmitting}
                type='submit'
                paddingX='auto'
                _hover={{
                  borderColor: 'transparent',
                  boxShadow: '0 7px 10px rgba(0, 0, 0, 0.3)',
                }}
              >
                新規登録
              </Button>
            </VStack>
          </form>
          <Button
            as={NextLink}
            href='/signin'
            bg='white'
            width='100%'
            _hover={{
              borderColor: 'transparent',
              boxShadow: '0 7px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            ログインはこちらから
          </Button>
        </VStack>
      </Flex>
		</div>
  )
}