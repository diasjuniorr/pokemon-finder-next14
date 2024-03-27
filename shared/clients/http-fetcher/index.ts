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
      return errorResponse(new Error("resource not found"), 404);
    }

    if (!response.ok) {
      return errorResponse(new Error("error fetching JSON"));
    }

    return successResponse<T>(await response.json());
  } catch (err) {
    console.log("error fetching JSON", err);
    return errorResponse(new Error("error fetching JSON"));
  }
}
