import { SelectedPlaceInfoType } from "@/types/SelectedPlaceInfoType";

// マップの選択地情報（選択地なしの初期値）の定義
export const initializedSelectedPlaceInfo: SelectedPlaceInfoType = {
  center: { lat: 38.0, lng: 137.0 },
  zoom: 5,
  markerPosition: null,
  selectedPlace: null
};