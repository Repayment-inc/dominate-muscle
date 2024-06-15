// ApiResponseインターフェースの定義
type ApiResponse<T> = {
  resultCode: number;
  message: string;
  resultData?: T;
  error?: string;
};

const createSuccessResponse = <T>(
  message: string,
  data: T
): ApiResponse<T> => ({
  resultCode: 0,
  message,
  resultData: data,
});

const ApplicationError = (
  message: string,
  error: string
): ApiResponse<null> => ({
  resultCode: 90,
  message,
  error,
});

const SystemError = (message: string, error: string): ApiResponse<null> => ({
  resultCode: 99,
  message,
  error,
});

export { createSuccessResponse, ApplicationError, SystemError, ApiResponse };
