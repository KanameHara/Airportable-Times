//----------------------------------------------------------------
// 投稿作時用マップコンポーネント
//----------------------------------------------------------------
import React, { useRef, FC, useState, useEffect } from 'react';
import { GoogleMap, Autocomplete, Marker } from '@react-google-maps/api';
import { SelectedPlaceInfoType } from '@/types/SelectedPlaceInfoType';
import { initializedSelectedPlaceInfo } from '@/constants/InitializedSelectedPlaceInfo';
import { SelectedPhotoPositionType } from '@/types/SelectePhotoPositionType';

// スタイルの定義
const containerStyle: React.CSSProperties  = {
  width: '700px',
  height: '480px',
  borderRadius: '20px',
};

const inputStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  border: '1px solid #E2E8F0',
  width: '400px',
  height: '40px',
  padding: '0 12px',
  borderRadius: '5px',
  fontSize: '16px',
  outline: 'none',
  textOverflow: 'ellipsis',
  zIndex: 1000, // 全面に表示するためにz-indexを高く設定
};

// propsの型定義
interface MapforPostProps {
  onSelectedPhotoPosition: (latitude: number, longitude: number) => void;
  selectedPhotoPosition?: SelectedPhotoPositionType;
}

// <引数>
//  onSelectedPhotoPosition:撮影位置情報変更関数
//  selectedPhotoPosition:選択された撮影位置情報
const MapforPost: FC<MapforPostProps> = ({ onSelectedPhotoPosition, selectedPhotoPosition }) => {

  // autocomplete オブジェクトを保持するためのref
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
	
	// 撮影位置情報の初期化
  const [postPlaceInfo, setPostPlaceInfo] = useState(initializedSelectedPlaceInfo);
  
  useEffect(() => {
    if (
      selectedPhotoPosition?.latitude &&
      selectedPhotoPosition?.longitude &&
      (selectedPhotoPosition.latitude !== postPlaceInfo.center.lat ||
       selectedPhotoPosition.longitude !== postPlaceInfo.center.lng)
    ) {
      setPostPlaceInfo({
        center: { lat: selectedPhotoPosition.latitude, lng: selectedPhotoPosition.longitude },
        zoom: 14,
        markerPosition: { lat: selectedPhotoPosition.latitude, lng: selectedPhotoPosition.longitude },
        selectedPlace: null,
      });
      onSelectedPhotoPosition(selectedPhotoPosition.latitude, selectedPhotoPosition.longitude);
    }
  }, [selectedPhotoPosition, postPlaceInfo.center.lat, postPlaceInfo.center.lng, onSelectedPhotoPosition]);

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

        const positionInfo = {
          geometry: {
            location: {
              toJSON: () => ({ lat, lng })
            }
          }
        };
        onPlaceSelected(positionInfo as google.maps.places.PlaceResult);
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
        <input type="text" placeholder='場所を検索' style={inputStyle} />
      </Autocomplete>
      <div style={{ marginTop: '15px'}}>
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