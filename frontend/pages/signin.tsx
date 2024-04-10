//----------------------------------------------------------------
// ログインページ
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
import { signInWithEmail } from '@/lib/firebase/api/auth'
import { useRouter } from 'next/router';

// フォームで使用する変数の型を定義
type formInputs = {
  email: string
  password: string
}

/** サインイン画面
 * @screenname SignInScreen
 * @description ユーザのサインインを行う画面
 */
export default function SignInScreen() {

  const { handleSubmit, register } = useForm<formInputs>()
  const [show, setShow] = useState<boolean>(false)
	const router = useRouter();

	const onSubmit = handleSubmit(async (data) => {
		signInWithEmail({ email: data.email, password: data.password }).then(
      (res: boolean) => {
        if (res) {
					console.log('ログイン成功')
					router.push('/home'); // ログイン後にホーム画面に遷移
        } else {
					console.log('ログイン失敗')
					alert('ログインに失敗しました')
        }
      }
    )
	})

  return (
		<div>
			<Head>
				<title>ログイン</title>
			</Head>
			<Header userName="userName" showButtonFlag={false} />
			<Flex
        flexDirection='column'
        width='100%'
        height='80vh'
        justifyContent='center'
        alignItems='center'
      >
        <VStack spacing='10'>
          <Heading>Airportable Timesにログイン</Heading>
          <form onSubmit={onSubmit}>
            <VStack spacing='4' alignItems='left'>
              <FormControl>
                <FormLabel htmlFor='email' textAlign='start'>
                  メールアドレス
                </FormLabel>
                <Input id='email' {...register('email')} />
              </FormControl>
  
              <FormControl>
                <FormLabel htmlFor='password'>パスワード</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                      {show ? 'Hide' : 'Show'}
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
                ログイン
              </Button>
              <Button
                as={NextLink}
                bg='white'
                color='black'
                href='/signup'
                width='100%'
              >
                新規登録はこちらから
              </Button>
            </VStack>
          </form>
        </VStack>
      </Flex>
		</div>
  )
}