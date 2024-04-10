//----------------------------------------------------------------
// firebaseとのAPI
//----------------------------------------------------------------
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

import { auth } from '../../config'

/**
 * EmailとPasswordでサインイン
 * @param email
 * @param password
 * @returns Promise<boolean>
 */
export const signInWithEmail = async (args: {
  email: string
  password: string
}): Promise<boolean> => {
  let result: boolean = false
  try {
    const user = await signInWithEmailAndPassword(
      auth,
      args.email,
      args.password
    )

    if (user) {
      result = true
    }
  } catch (error) {
    result = false
    console.log(error)
  }
  return result
}

/**
 * EmailとPasswordでサインアップ
 * @param username
 * @param email
 * @param password
 * @returns Promise<boolean>
 */
export const signUpWithEmail = async (args: {
  email: string
  password: string
}): Promise<boolean> => {
  let result: boolean = false
  try {
    const user = await createUserWithEmailAndPassword(
      auth,
      args.email,
      args.password
    )
    if (user) {
      result = true
    }
  } catch (error) {
    result = false
    console.log(error)
  }
  return result
}

/**
 * ログアウト処理
 * @returns Promise<boolean>
 */
export const logout = async (): Promise<boolean> => {
  let result: boolean = false

  await signOut(auth)
    .then(() => {
      result = true
    })
    .catch((error) => {
      console.log(error)
      result = false
    })

  return result
}