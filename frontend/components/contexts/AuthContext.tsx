//----------------------------------------------------------------
// Auth情報を管理するコンテキスト
//----------------------------------------------------------------
import React, { useContext, useState, useEffect, FC, ReactNode } from 'react'
import { auth } from '../../lib/firebase/config'
import { onAuthStateChanged, User } from 'firebase/auth'

// Authコンテキストを作成
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Auth情報の型定義
interface AuthContextType {
	currentUser: User | null;
}

// Auth情報を使用するためのフック関数
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
			throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

// Auth情報プロバイダーのPropsの型定義
interface AuthProviderProps {
  children: ReactNode;
}

// Auth情報のプロバイダー
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {

		const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)	// user情報の読込中はtrue

    // 第2引数に[]を指定して、初回レンダリングのみ関数を実行させる
    useEffect(() => {
        // onAuthStateChangedでログインの状態を監視する
        const unsubscribe = onAuthStateChanged(auth, async user => {
            // ユーザー情報を格納する
						setCurrentUser(user)
            setLoading(false)	// ユーザー情報の読込が完了したのでfalse
        })
        return unsubscribe
    }, [])

		// user情報をchildrenに渡す
    const value = {currentUser}

    // _app.jsで全コンポーネントをラッピングするためのプロバイダー
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}