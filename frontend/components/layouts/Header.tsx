//----------------------------------------------------------------
// 全ページのヘッダーコンポーネント
//----------------------------------------------------------------
import { Box, Flex, Button } from '@chakra-ui/react';
import Image from 'next/image';
import React, { FC } from 'react';
import { logout } from '@/lib/firebase/api/auth';
import { useRouter } from 'next/router';

// スタイルの定義
const containerStyle: React.CSSProperties = {
  position: 'relative'
};

const userNameStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: '35px',
  color: 'white',
  bottom: '140px', // 画像の下から1pxの位置に配置
  left: '85%', // 左から85%の位置に配置
};

const buttonStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '1px', // 画像の下から1pxの位置に配置
  left: '75%', // 左から75%の位置に配置
};

// Propsの型定義
interface HeaderProps {
  userName: string;
  showButtonFlag: boolean;
}

// <引数>
//  useName:ユーザー名
//  showButtonFlag:マイページのボタンコンポーネント表示フラグ(TRUE：表示，FALSE：非表示)
const Header: FC<HeaderProps> = ({ userName, showButtonFlag }) => {

  const router = useRouter();

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
          <div style={userNameStyle}>{userName}</div>
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
