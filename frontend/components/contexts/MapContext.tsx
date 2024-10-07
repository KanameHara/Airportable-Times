//----------------------------------------------------------------
// マップの情報を管理するコンテキスト
//----------------------------------------------------------------
import React, { createContext, useContext, useState, FC, ReactNode } from 'react';
import { SelectedPlaceInfoType } from '@/types/SelectedPlaceInfoType';
import { initializedSelectedPlaceInfo } from '@/constants/InitializedSelectedPlaceInfo';

// コンテキストの型定義
interface MapContextType {

  selectedPlaceInfo: SelectedPlaceInfoType;

  // 選択地点情報更新関数の型定義（引数infoはPartial<T>型でundefinedを渡し可、戻り値はvoid）
  updateSelectedPlaceInfo: (info: Partial<SelectedPlaceInfoType>) => void;
}

// マップコンテキストを作成（undefinedで初期化）
const MapContext = createContext<MapContextType | undefined>(undefined);

// 外部ファイルからコンテキストを使用するためのフック関数
export const useMap = () => {

  // 現在のコンテキストの値を取得
  const context = useContext(MapContext);

  // MapProviderでラップされていない場合はエラーをスロー(_app.tsxでラップが必要)
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }

  return context;
};

// マッププロバイダーのPropsの型定義
interface MapProviderProps {
  children: ReactNode;
}

// mapProviderコンポーネントの定義
export const MapProvider: FC<MapProviderProps> = ({ children }) => {
  
  // マップの選択地情報(初期値)を設定
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<SelectedPlaceInfoType>(initializedSelectedPlaceInfo);

  // マップ情報の更新関数の定義
  const updateSelectedPlaceInfo = (info: Partial<SelectedPlaceInfoType>) => {
    setSelectedPlaceInfo(prevInfo => ({ ...prevInfo, ...info }));
  };

  return (
    <MapContext.Provider value={{ selectedPlaceInfo, updateSelectedPlaceInfo }}>
      {children}
    </MapContext.Provider>
  );
};