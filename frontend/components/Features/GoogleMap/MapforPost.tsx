//----------------------------------------------------------------
// 投稿作時用マップコンポーネント
//----------------------------------------------------------------
import React, { useRef, FC, useState, useEffect } from 'react';
import { GoogleMap, Autocomplete, Marker } from '@react-google-maps/api';
import { useMap } from '../../contexts/MapContext';
import { SelectedPlaceInfoType } from '@/types/SelectedPlaceInfoType';
import { initializedSelectedPlaceInfo } from '@/constants/InitializedSelectedPlaceInfo';
import { SelectedPhotoPositionType } from '@/types/SelectePhotoPositionType';

// スタイルの定義
const containerStyle: React.CSSProperties  = {
  width: '600px',
  height: '400px'
};

const inputStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  border: '1px solid transparent',
  width: '300px',
  height: '40px',
  padding: '0 12px',
  borderRadius: '5px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  fontSize: '14px',
  outline: 'none',
  textOverflow: 'ellipsis',
  marginLeft: '10px',
  zIndex: 1000, // 全面に表示するためにz-indexを高く設定
};

// propsの型定義
interface MapforPostProps {
  onSelectedPhotoPosition: (latitude: number, longitude: number) => void;
  selectedPhotoPosition?: SelectedPhotoPositionType;
}

// <引数>
//  onSelectedPhotoPosition:撮影位置情報変更関数
//  selectedPhotoPosition:選択された撮影位置情報（既存の投稿データ表示時以外はオプショナルなので指定しないこと）
const MapforPost: FC<MapforPostProps> = ({ onSelectedPhotoPosition, selectedPhotoPosition }) => {

  // autocomplete オブジェクトを保持するためのref
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // 空港位置情報を取得
	const { selectedPlaceInfo } = useMap();
	
	// 撮影位置情報の初期化(最初の画面表示時はユーザー選択中の空港の位置としておく)
  const [postPlaceInfo, setPostPlaceInfo] = useState(initializedSelectedPlaceInfo);

  // selectedPlaceInfo が変更されたときだけ postPlaceInfo を更新する
  useEffect(() => {

    // ステートを更新
    setPostPlaceInfo(selectedPlaceInfo);

    // 撮影位置情報を更新
    if (selectedPhotoPosition?.latitude && selectedPhotoPosition?.longitude) {

      // 引数で場所を指定されている場合は、その場所を撮影位置として設定
      onSelectedPhotoPosition(selectedPhotoPosition.latitude, selectedPhotoPosition.longitude);
    }
    else {

      // 引数で場所を指定されていない場合は、現在選択中の空港位置を撮影場所として設定
      onSelectedPhotoPosition(selectedPlaceInfo.center.lat, selectedPlaceInfo.center.lng);
    }
  }, [selectedPlaceInfo]);

  // 撮影位置情報を更新する関数
  const onPlaceSelected = (place: google.maps.places.PlaceResult | null) => {

    if (place?.geometry?.location)
    {
			const newPostPlaceInfo: SelectedPlaceInfoType = {
				center: place.geometry.location.toJSON(), // toJSON()で経度緯度情報をJSON形式に変換
				zoom: 14,
				markerPosition: place.geometry.location.toJSON(),
				selectedPlace: place,
      };
      
      // ステートを更新
      setPostPlaceInfo(newPostPlaceInfo);

      // 撮影位置情報を更新
      onSelectedPhotoPosition(place.geometry.location.toJSON().lat, place.geometry.location.toJSON().lng);
		}
  };

  // マップのクリック(撮影位置選択)時ハンドラ
  const handleMapClick = (event: google.maps.MapMouseEvent | null) => {

    if (event)
    {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();

      if (lat && lng)
      {
        const newPostPlaceInfo: SelectedPlaceInfoType = {
          ...postPlaceInfo,
          center: { lat, lng },
          markerPosition: { lat, lng }
        };
        
        setPostPlaceInfo(newPostPlaceInfo);
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
        <input type="text" style={inputStyle} />
      </Autocomplete>
      <div style={{ marginTop: '15px', marginLeft: '10px', marginBottom: '50px' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={postPlaceInfo.center}
          zoom={postPlaceInfo.zoom}
          onClick={handleMapClick}
        >
          {postPlaceInfo.markerPosition && <Marker position={postPlaceInfo.markerPosition} />}
        </GoogleMap>
      </div>
    </div>
  );
}

export default React.memo(MapforPost);