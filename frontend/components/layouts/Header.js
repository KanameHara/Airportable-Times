//----------------------------------------------------------------
// 全ページのヘッダーコンポーネント
//----------------------------------------------------------------
import { Box, Flex, Button } from '@chakra-ui/react'
import Image from 'next/image';

// スタイルの定義
const containerStyle = {
  position: 'relative'
};

const userNameStyle = {
  position: 'absolute',
  fontSize: '35px',
  color: 'white',
  bottom: '140px', // 画像の下から1pxの位置に配置
  left: '85%', // 左から85%の位置に配置
};

const buttonStyle = {
  bgColor: "#BEE3F8",
  size: 'lg',
  position: 'absolute',
  bottom: '1px', // 画像の下から1pxの位置に配置
  left: '75%', // 左から75%の位置に配置
};

// <引数>
//  useName:ユーザー名
//  showButtonFlag:マイページのボタンコンポーネント表示フラグ(TRUE：表示，FALSE：非表示)
function Header({userName, showButtonFlag}) {
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
            <Button>HOME</Button>
            <Button margin="15px">マイページ</Button>
            <Button>ログアウト</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;


