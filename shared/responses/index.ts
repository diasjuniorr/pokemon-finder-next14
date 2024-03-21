export type ErrorResponse = {
  hasError: boolean;
  error?: Error;
  code?: number;
};

export type SuccessResponse<T> = {
  data: T | null;
};

export function errorResponse(
  error: Error,
  code?: number
): [ErrorResponse, SuccessResponse<null>] {
  return [
    {
      error,
      hasError: true,
      code: code || 500,
    },
    {
      data: null,
    },
  ];
}

export function successResponse<T>(
  data: T
): [ErrorResponse, SuccessResponse<T>] {
  return [
    {
      hasError: false,
    },
    {
      data,
    },
  ];
}
