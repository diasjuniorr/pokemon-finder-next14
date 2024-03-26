import {
  ErrorResponse,
  errorResponse,
  successResponse,
} from "@/shared/responses";

type FetchJsonResponse<T> = [ErrorResponse, FetchJsonSuccessResponse<T>];

export interface FetchJsonSuccessResponse<T> {
  data: T | null;
}

export async function fetchJson<T>(url: string): Promise<FetchJsonResponse<T>> {
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      return errorResponse(new Error("Resource not found"), 404);
    }

    return successResponse<T>(await response.json());
  } catch (err) {
    console.log("Error fetching JSON", err);
    return errorResponse(new Error("Error fetching JSON"));
  }
}
