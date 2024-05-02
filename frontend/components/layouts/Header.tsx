//----------------------------------------------------------------
// 全ページのヘッダーコンポーネント
//----------------------------------------------------------------
import { Box, Flex, Button } from '@chakra-ui/react';
import Image from 'next/image';
import React, { FC, useState, useEffect } from 'react';
import { logout } from '@/lib/firebase/api/auth';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserInfoByEmail } from '@/lib/mysql/api/database';
import { UserInfoType } from '@/types/UserInfoType';

// スタイルの定義
const containerStyle: React.CSSProperties = {
  position: 'relative'
};

const userNameStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: '35px',
  color: 'white',
  bottom: '140px', // 画像の下から1pxの位置に配置
  right: '5%',      // 右から15%の位置に配置
  textAlign: 'right' // テキストを右揃えにする
};

const buttonStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '1px', // 画像の下から1pxの位置に配置
  left: '75%', // 左から75%の位置に配置
};

// Propsの型定義
interface HeaderProps {
  showButtonFlag: boolean;
}

// <引数>
//  showButtonFlag:マイページのボタンコンポーネント表示フラグ(TRUE：表示，FALSE：非表示)
const Header: FC<HeaderProps> = ({ showButtonFlag }) => {

  const router = useRouter();

  // // ユーザー名を取得
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfoType>();

  useEffect(() => {
    const getUserInfo = async () => {
      const info = await fetchUserInfoByEmail(currentUser?.email);
      setUserInfo(info);
    };

    if (currentUser?.email) {
      getUserInfo();
    }
  }, [currentUser?.email]);  // currentUser.email が変更されたときに再実行

  // ログアウトボタンのハンドラ
  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      console.log('ログアウト成功');
      router.push('/signin'); // ログインページにリダイレクト
    } else {
      console.error('ログアウト失敗');
      alert('ログアウトに失敗しました');
    }
  };

  return (
    <div style={containerStyle}>
      <Flex>
        <Box p={5} fontSize="80px" bgColor="#BEE3F8" w="60%" h="200px">
          Airportable Times
        </Box>
        <div style={{ position: 'relative', height: '200px', width: '40%' }}>
          <Image src="/images/headerimage.png" alt="ヘッダー画像" layout="fill" objectFit="contain" />
        </div>
      </Flex>
      {showButtonFlag && (
        <div>
          <div style={userNameStyle}>{userInfo?.userName}さん</div>
          <div style={buttonStyle}>
            <Button colorScheme="blue">HOME</Button>
            <Button margin="15px" colorScheme="blue">マイページ</Button>
            <Button colorScheme="blue" onClick={handleLogout}>ログアウト</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;