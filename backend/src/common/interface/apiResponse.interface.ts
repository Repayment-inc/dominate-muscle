// ApiResponseインターフェースの定義
export interface ApiResponse<T> {
  resultCode: number;
  message: string;
  resultData?: T;
}
