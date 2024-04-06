//----------------------------------------------------------------
// 空港検索用マップコンポーネント
//----------------------------------------------------------------
import React, { useRef, FC } from 'react';
import { GoogleMap, Autocomplete, Marker, InfoWindow } from '@react-google-maps/api';
import { useMap } from '../contexts/MapContext';
import { SelectedPlaceInfoType } from '@/types/SelectedPlaceInfoType';
import { initializedSelectedPlaceInfo } from '@/constants/InitializedSelectedPlaceInfo';

// スタイルの定義
const containerStyle: React.CSSProperties  = {
  width: '800px',
  height: '600px'
};

const inputStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  border: '1px solid transparent',
  width: '400px',
  height: '40px',
  padding: '0 12px',
  borderRadius: '5px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  fontSize: '14px',
  outline: 'none',
  textOverflow: 'ellipsis',
  position: 'absolute',
  top: '355px',
  left: '35%',
  marginLeft: '-200px',
  zIndex: 1000, // 全面に表示するためにz-indexを高く設定
};

const Map: FC = () => {

  // autocomplete オブジェクトを保持するためのref
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // マップの選択地情報を取得
  const { selectedPlaceInfo, updateSelectedPlaceInfo } = useMap();

  // 検索結果によりマップの選択地情報を更新する関数
  const onPlaceSelected = (place: google.maps.places.PlaceResult | null) => {

    // 場所を選択しているか
    if (place) {
      // 選択地が空港か
      if (place.geometry && place.types && place.types.includes("airport")) {
        // 選択地が日本国内か
        const isJapan = place.address_components?.some(component =>
          component.types.includes("country") && component.short_name === "JP"
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
          alert("日本国内の空港を選択してください。");
        }
      }
      // 選択地が空港でない場合
      else {
        alert("選択された場所は空港ではありません。");
      }
    }
  };

  return (
    <div>
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
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedPlaceInfo.center}
        zoom={selectedPlaceInfo.zoom}
      >
        {selectedPlaceInfo.markerPosition && <Marker position={selectedPlaceInfo.markerPosition} />}
        {selectedPlaceInfo.selectedPlace && (
          <InfoWindow
            position={selectedPlaceInfo.markerPosition}
            onCloseClick={() => updateSelectedPlaceInfo(initializedSelectedPlaceInfo)}>
            <div>
              <h3>{selectedPlaceInfo.selectedPlace.name}</h3>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default React.memo(Map);