//----------------------------------------------------------------
// ホーム画面
//----------------------------------------------------------------
import Head from "next/head"; 
import Header from "../components/layouts/Header";
import Map from "../components/Features/GoogleMap/Map";
import { useMap } from '../components/contexts/MapContext';
import { Flex, Button, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { initializedSelectedPlaceInfo } from "@/constants/InitializedSelectedPlaceInfo";

export default function Home() { 
  // ログイン後ユーザー名を取得してHeaderコンポーネントの引数に渡す。※現時点では仮にuserNameとしておく

  // マップの選択地情報を取得
  const { selectedPlaceInfo, updateSelectedPlaceInfo } = useMap();

  // 空港選択後のキャンセルボタンのハンドラ
  const handleCancelButtonClick = () => {
    
    // マップの選択地情報を初期化
    updateSelectedPlaceInfo(initializedSelectedPlaceInfo);
  };

  // 動的ページ生成のためのrouter
  const router = useRouter();

  // 空港選択後のOKボタンのハンドラ
  const handleOkButtonClick = () => {
    // placeIDを取得
    const placeID = selectedPlaceInfo.selectedPlace?.place_id;
    if (placeID) {
      // 取得できたら各空港TOP画面に遷移
      router.push(`/${placeID}`);
    }
    else
    {
      // 取得できないなら何もしない
    }
  };

  return (
    <div>
      <Head>
        <title>空港検索</title>
      </Head>
      <Header showButtonFlag={true} />
      <Box
        p={5}
        mt={10}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        width="78%"
        mx="auto"
        maxW="1100px"
        maxH="800px"
      >
        <div style={{ marginBottom: '40px', marginLeft: '135px' }}>日本各地の空港を検索できます。</div>
        <Flex>
          <div style={{ marginBottom: '50px', flex: 1 }}>
            <Map onOkButtonClick={handleOkButtonClick} onCancelButtonClick={handleCancelButtonClick}/>
          </div>
        </Flex>
      </Box>
    </div>
  );
}