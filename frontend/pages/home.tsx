//----------------------------------------------------------------
// ホーム画面
//----------------------------------------------------------------
import Head from "next/head"; 
import Header from "../components/layouts/Header";
import Map from "../components/layouts/Map";
import { useMap } from '../components/contexts/MapContext';
import { Flex ,Button } from '@chakra-ui/react'

export default function Home() { 
  // ログイン後ユーザー名を取得してHeaderコンポーネントの引数に渡す。※現時点では仮にuserNameとしておく

  // マップの選択地情報を取得
  const { selectedPlaceInfo, updateSelectedPlaceInfo } = useMap();

  // 空港選択後のキャンセルボタンのハンドラ
  const handleCancelButtonClick = () => {
    // マップの選択地情報を初期化
    const initializedSelectedPlaceInfo = {
      center: { lat: 38.0, lng: 137.0 },
      zoom: 5,
      markerPosition: null,
      selectedPlace: null
    };
    updateSelectedPlaceInfo(initializedSelectedPlaceInfo);
  };

  return (
    <div>
      <Head>
        <title>空港検索</title>
      </Head>
      <Header userName="userName" showButtonFlag={true} />
      <div style={{ marginTop: '80px', marginBottom: '40px', marginLeft: '100px' }}>日本各地の空港を検索できます。</div>
      <Flex>
        <div style={{ marginLeft: '100px', marginBottom: '50px' }}><Map /></div>
        {selectedPlaceInfo.selectedPlace && (
          <div>
            <div style={{ marginTop: '50px', marginLeft: '100px', marginBottom: '20px' }}>
              {selectedPlaceInfo.selectedPlace.name}に決定しますか？
            </div>
            <Button ml={90} mt={5}>決定</Button>
            <Button ml={10} mt={5} onClick={handleCancelButtonClick}>キャンセル</Button>
          </div>
        )}
      </Flex>      
    </div>
  );
}