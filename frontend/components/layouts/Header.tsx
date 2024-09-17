//----------------------------------------------------------------
// 全ページのヘッダーコンポーネント
//----------------------------------------------------------------
import { Box, Flex, Button } from '@chakra-ui/react';
import Image from 'next/image';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { logout } from '@/lib/firebase/api/auth';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserInfoByEmail } from '@/lib/mysql/api/database';
import { UserInfoType } from '@/types/UserInfoType';
import { useMap } from '../contexts/MapContext';
import { initializedSelectedPlaceInfo } from "@/constants/InitializedSelectedPlaceInfo";
import Link from 'next/link';

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '70px',
  backgroundColor: '#90cdf4',
};

const userNameStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: '16px',
  fontWeight: 'bold',
  color: 'white',
  top: '24px',
  right: '33%',
  textAlign: 'right',
};

const buttonContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '15px',
  right: '3%',
  display: 'flex',
  gap: '10px', 
};

interface HeaderProps {
  showButtonFlag: boolean;
}

const Header: FC<HeaderProps> = ({ showButtonFlag }) => {
  const router = useRouter();
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
  }, [currentUser?.email]);

  const { updateSelectedPlaceInfo } = useMap();

  const handleHomeButtonClick = useCallback(() => {
    updateSelectedPlaceInfo(initializedSelectedPlaceInfo);
    router.push('/home');
  }, [updateSelectedPlaceInfo, router]);

  const handleMyPageButtonClick = () => {
    router.push('/mypage/posts');
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      console.log('ログアウト成功');
      router.push('/signin');
    } else {
      console.error('ログアウト失敗');
      alert('ログアウトに失敗しました');
    }
  };

  return (
    <div style={containerStyle}>
      <Flex ml={10} align="center" position="relative" height="100%">
        <Link href="/home" passHref>
          <Box 
            as="a" 
            color="white" 
            fontSize="30px" 
            position="relative" 
            zIndex={1} 
            cursor="pointer"
          >
            Airportable Times
          </Box>
        </Link>
        {showButtonFlag && (
          <>
            <div style={userNameStyle}>{userInfo?.userName}さん</div>
            <div style={buttonContainerStyle}>
              <Button onClick={handleHomeButtonClick} width={36}>HOME</Button>
              <Button onClick={handleMyPageButtonClick} width={36}>マイページ</Button>
              <Button onClick={handleLogout} width={36}>ログアウト</Button>
            </div>
          </>
        )}
      </Flex>
      {!showButtonFlag && (
        <div style={{ position: 'relative', height: '260px', width: '100%' }}>
          <Image src="/images/headerImage1.jpg" alt="ヘッダー画像" layout="fill" objectFit="cover" />
        </div>
      )}
    </div>
  );
};

export default React.memo(Header);