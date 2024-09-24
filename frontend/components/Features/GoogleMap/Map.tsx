//----------------------------------------------------------------
// 空港検索用マップコンポーネント
//----------------------------------------------------------------
import React, { useRef, FC } from 'react';
import { GoogleMap, Autocomplete, Marker, InfoWindow } from '@react-google-maps/api';
import { useMap } from '../../contexts/MapContext';
import { SelectedPlaceInfoType } from '@/types/SelectedPlaceInfoType';
import { initializedSelectedPlaceInfo } from '@/constants/InitializedSelectedPlaceInfo';
import { Button } from '@chakra-ui/react';

interface MapProps {
  onOkButtonClick: () => void;
  onCancelButtonClick: () => void;
}

// スタイルの定義
const containerStyle: React.CSSProperties = {
  width: '700px',
  height: '480px',
  marginRight: '890px',
  borderRadius: '20px',
};

const inputStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  border: '1px solid #E2E8F0',
  width: '400px',
  height: '40px',
  padding: '0 12px',
  borderRadius: '5px',
  fontSize: '14px',
  textOverflow: 'ellipsis',
  position: 'absolute',
  top: '300px',
  left: '41%',
  transform: 'translateX(-50%)',
  zIndex: 1000, // 全面に表示するためにz-indexを高く設定
};

const mapWrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh', // 画面全体の高さ
  width: '100vw', // 画面全体の幅
};

const infoWindowContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize : '16px',
};

const Map: FC<MapProps> = ({ onOkButtonClick, onCancelButtonClick }) => {
  // autocomplete オブジェクトを保持するためのref
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // マップの選択地情報を取得
  const { selectedPlaceInfo, updateSelectedPlaceInfo } = useMap();

  // 検索結果によりマップの選択地情報を更新する関数
  const onPlaceSelected = (place: google.maps.places.PlaceResult | null) => {
    // 場所を選択しているか
    if (place) {
      // 選択地が空港か
      if (place.geometry && place.types && place.types.includes('airport')) {
        // 選択地が日本国内か
        const isJapan =
          place.address_components?.some(
            (component) => component.types.includes('country') && component.short_name === 'JP'
          ) || false;

        // 日本国内なら選択地情報を更新
        if (isJapan && place.geometry.location) {
          const newSelectedPlaceInfo: SelectedPlaceInfoType = {
            center: place.geometry.location.toJSON(), // toJSON()で経度緯度情報をJSON形式に変換
            zoom: 14,
            markerPosition: place.geometry.location.toJSON(),
            selectedPlace: place,
          };
          updateSelectedPlaceInfo(newSelectedPlaceInfo);
        }
        // 日本国内ではない場合
        else {
          alert('日本国内の空港を選択してください。');
        }
      }
      // 選択地が空港でない場合
      else {
        alert('選択された場所は空港ではありません。');
      }
    }
  };

  return (
    <div style={mapWrapperStyle}>
      <Autocomplete
        onLoad={(autocomplete: google.maps.places.Autocomplete) => {
          autocompleteRef.current = autocomplete; // onLoad で autocomplete オブジェクトを ref に保存
        }}
        onPlaceChanged={() => {
          if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace(); // ref から autocomplete オブジェクトを取得
            onPlaceSelected(place);
          }
        }}
      >
        <input type="text" placeholder="空港名を入力してください。" style={inputStyle} />
      </Autocomplete>
      <GoogleMap mapContainerStyle={containerStyle} center={selectedPlaceInfo.center} zoom={selectedPlaceInfo.zoom}>
        {selectedPlaceInfo.markerPosition && <Marker position={selectedPlaceInfo.markerPosition} />}
        {selectedPlaceInfo.selectedPlace && (
          <InfoWindow
            position={selectedPlaceInfo.markerPosition || undefined}
            onCloseClick={() => updateSelectedPlaceInfo(initializedSelectedPlaceInfo)}
          >
            <div style={infoWindowContentStyle}>
              <h2>{selectedPlaceInfo.selectedPlace.name}に決定しますか？</h2>
              <Button
                width='105px'
                m={5}
                bg='blue.400'
                color='white'
                onClick={onOkButtonClick}
                _hover={{
                  borderColor: 'transparent',
                  boxShadow: '0 7px 10px rgba(0, 0, 0, 0.3)',
                }}
              >
                決定
              </Button>
              <Button onClick={onCancelButtonClick}>キャンセル</Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(Map);