// ApiResponseインターフェースの定義
type ApiResponse<T> = {
  resultCode: number;
  message: string;
  resultData?: T;
  error?: string;
};

// Result codesをEnumで定義
enum ResultCode {
  Success = 0,
  ApplicationError = 90,
  SystemError = 99,
}

const createSuccessResponse = <T>(
  message: string,
  data: T
): ApiResponse<T> => ({
  resultCode: ResultCode.Success,
  message,
  resultData: data,
});

const ApplicationError = (
  // message: string,
  errorMessage: string
): ApiResponse<void> => ({
  resultCode: ResultCode.ApplicationError,
  message: "業務エラー",
  error: errorMessage,
});

const SystemError = (): ApiResponse<void> => ({
  resultCode: ResultCode.SystemError,
  message: "予期せぬエラーが発生しました",
});

export {
  createSuccessResponse,
  ApplicationError,
  SystemError,
  ApiResponse,
  ResultCode,
};
