// マップの選択地情報の型定義
export interface SelectedPlaceInfoType {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markerPosition: google.maps.LatLngLiteral | null;
  selectedPlace: google.maps.places.PlaceResult | null;
}
