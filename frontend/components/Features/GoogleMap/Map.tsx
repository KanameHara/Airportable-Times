//----------------------------------------------------------------
// 空港検索用マップコンポーネント
//----------------------------------------------------------------
import React, { useRef, FC } from 'react';
import { GoogleMap, Autocomplete, Marker } from '@react-google-maps/api';
import { useMap } from '../../contexts/MapContext';
import { SelectedPlaceInfoType } from '@/types/SelectedPlaceInfoType';
import { Button, Box, Text } from '@chakra-ui/react';

interface MapProps {
  onOkButtonClick: () => void;
  onCancelButtonClick: () => void;
}

// スタイルの定義
const containerStyle: React.CSSProperties = {
  width: '700px',
  height: '480px',
  marginRight: '890px',
  marginBottom: '110px',
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
  textOverflow: 'ellipsis',
  position: 'absolute',
  top: '185px',
  left: '41%',
  transform: 'translateX(-50%)',
};

const mapWrapperStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'end',
  height: '80vh',
  width: '100vw',
};

const infoBoxStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '515px',
  right: '340px',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  backgroundColor: 'white',
  padding: '10px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const Map: FC<MapProps> = ({ onOkButtonClick, onCancelButtonClick }) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); 
  const { selectedPlaceInfo, updateSelectedPlaceInfo } = useMap();

  const onPlaceSelected = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      if (place.geometry && place.types && place.types.includes('airport')) {
        const isJapan =
          place.address_components?.some(
            (component) => component.types.includes('country') && component.short_name === 'JP'
          ) || false;

        if (isJapan && place.geometry.location) {
          const newSelectedPlaceInfo: SelectedPlaceInfoType = {
            center: place.geometry.location.toJSON(),
            zoom: 14,
            markerPosition: place.geometry.location.toJSON(),
            selectedPlace: place,
          };
          updateSelectedPlaceInfo(newSelectedPlaceInfo);
        } else {
          alert('日本国内の空港を選択してください。');
        }
      } else {
        alert('選択された場所は空港ではありません。');
      }
    }
  };

  const handleCancelButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onCancelButtonClick();
  };

  return (
    <div style={mapWrapperStyle}>
      <Autocomplete
        onLoad={(autocomplete: google.maps.places.Autocomplete) => {
          autocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={() => {
          if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            onPlaceSelected(place);
          }
        }}
      >
        <input ref={inputRef} type="text" placeholder="空港を検索" style={inputStyle} />
      </Autocomplete>
      <GoogleMap mapContainerStyle={containerStyle} center={selectedPlaceInfo.center} zoom={selectedPlaceInfo.zoom}>
        {selectedPlaceInfo.markerPosition && <Marker position={selectedPlaceInfo.markerPosition} />}
      </GoogleMap>

      {selectedPlaceInfo.selectedPlace && (
        <Box style={infoBoxStyle}>
          <Text fontWeight="bold" fontSize="lg" mb={2} textAlign="center">
            {selectedPlaceInfo.selectedPlace.name}
          </Text>
          <Text fontSize="16px" mb={3} textAlign="center">
            に決定しますか？
          </Text>
          <Box display="flex" justifyContent="center" gap={4}>
            <Button
              width="105px"
              bg="blue.400"
              color="white"
              onClick={onOkButtonClick}
              _hover={{
                borderColor: 'transparent',
                boxShadow: '0 7px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              決定
            </Button>
            <Button onClick={handleCancelButtonClick}>
              キャンセル
            </Button>
          </Box>
        </Box>      
      )}
    </div>
  );
};

export default React.memo(Map);