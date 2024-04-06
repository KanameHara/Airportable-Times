//----------------------------------------------------------------
// 空港検索用マップコンポーネント
//----------------------------------------------------------------
import React, { useRef } from 'react';
import { GoogleMap, Autocomplete, Marker, InfoWindow } from '@react-google-maps/api';
import { useMap } from '../contexts/MapContext';

// スタイルの定義
const containerStyle = {
  width: '800px',
  height: '600px'
};

const inputStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `400px`,
  height: `40px`,
  padding: `0 12px`,
  borderRadius: `5px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  position: "absolute",
  top: "355px",
  left: "35%",
  marginLeft: "-200px", // 400pxの幅の半分
  zIndex: 1000 // 前面に表示するためにz-indexを高く設定
};

// マップの選択地情報（初期値）
const initializedSelectedPlaceInfo = {
  center: { lat: 38.0, lng: 137.0 },
  zoom: 5,
  markerPosition: null,
  selectedPlace: null
};

function Map() {
  // autocomplete オブジェクトを保持するための ref
  const autocompleteRef = useRef(null); 
  // マップ情報管理コンテキストから選択地情報と更新関数を取得
  const { selectedPlaceInfo, updateSelectedPlaceInfo } = useMap();
  

  // 検索結果でマップの表示情報を更新する関数
  const onPlaceSelected = (place) => { 

    // 場所を選択しているか
    if (place)
    {
      // 選択地が空港か
      if (place.geometry && place.types && place.types.includes("airport"))
      {
        // 日本国内であるか
        const isJapan = place.address_components.some(component =>
          component.types.includes("country") && component.short_name === "JP"
        );

        // 選択地が日本国内の空港であれば選択地の情報を保持
        if (isJapan)
        {
          // 選択地情報をコンテキストに設定
          const newSelectedPlaceInfo = {
            center: place.geometry.location,
            zoom: 14,
            markerPosition: place.geometry.location,
            selectedPlace: place,
          };
          updateSelectedPlaceInfo(newSelectedPlaceInfo);
        }
        else  // 選択地が日本国内でない場合
        {
          alert("日本国内の空港を選択してください。");
        }
      }
      else  // 選択地が空港でない場合
      {
        alert("選択された場所は空港ではありません。");
      }
    }
  };  

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => {
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
            onCloseClick={() => {
              updateSelectedPlaceInfo(initializedSelectedPlaceInfo);
            }}>
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