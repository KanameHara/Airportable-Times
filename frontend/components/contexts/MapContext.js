//----------------------------------------------------------------
// マップの情報を管理するコンテキスト
//----------------------------------------------------------------
import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext();
export const useMap = () => useContext(MapContext);
export const MapProvider = ({ children }) => {
  
  // マップ情報を定義
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState({
    center: { lat: 38.0, lng: 137.0 },
    zoom: 5,
    markerPosition: null,
    selectedPlace: null,
    // 他に追加したいグローバルなデータがあればここに追加
  });

  // マップ情報の更新関数の定義
  const updateSelectedPlaceInfo = (info) => {
    setSelectedPlaceInfo(prevInfo => ({ ...prevInfo, ...info }));
  };

  return (
    <MapContext.Provider value={{ selectedPlaceInfo, updateSelectedPlaceInfo }}>
      {children}
    </MapContext.Provider>
  );
};