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
	FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
	InputRightElement,
	useToast,
  VStack,
  Box
} from '@chakra-ui/react'
import Head from "next/head";
import Header from "@/components/layouts/Header";
import { signInWithEmail } from '@/lib/firebase/api/auth'
import { useRouter } from 'next/router';
import { FirebaseResult } from '@/lib/firebase/api/auth'
import Footer from '@/components/layouts/Footer'

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

  const { handleSubmit, register, formState: { errors, isSubmitting }, } = useForm<formInputs>()
  const [show, setShow] = useState<boolean>(false)
	const router = useRouter();
	const toast = useToast()

	const onSubmit = handleSubmit(async (data) => {
    await signInWithEmail({
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
					router.push('/home'); // ログイン後にホーム画面に遷移
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

  return (
		<div>
			<Head>
				<title>ログイン</title>
			</Head>
      <Header showButtonFlag={false} />
        <Flex
          flexDirection='column'
          width='100%'
          height='80vh'
          justifyContent='center'
          alignItems='center'
        >
          <Box p={5} mt={20} shadow="md" borderWidth="1px" flex="1" w="40%" height="auto" maxH="450px">
            <VStack spacing='10'>
              <Heading>Airportable Timesにログイン</Heading>
              <form onSubmit={onSubmit}>
                <VStack spacing='4' alignItems='left'>
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
                      })}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>
                    
                  <FormControl isInvalid={Boolean(errors.password)}>
                    <FormLabel htmlFor='password'>パスワード</FormLabel>
                    <InputGroup size='md'>
                      <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
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
                        })}
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                          {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
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
                    ログイン
                  </Button>
                  <Button
                    as={NextLink}
                    bg='white'
                    color='black'
                    href='/signup'
                    width='100%'
                    _hover={{
                      borderColor: 'transparent',
                      boxShadow: '0 7px 10px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    新規登録はこちらから
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        </Flex>
      <Footer />
		</div>
  )
}