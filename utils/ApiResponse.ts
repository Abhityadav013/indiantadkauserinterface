import { ValidationErrorResponse } from "@/lib/types/api_response";


export default class ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: T, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

// Type guard function to check if the response is of type ValidationErrorResponse
export function isValidationErrorResponse<T>(response: ValidationErrorResponse | ApiResponse<T>): response is ValidationErrorResponse {
    return 'data' in response && Array.isArray(response.data) && response.data.every(
        (item) => item.hasOwnProperty('key') && item.hasOwnProperty('message')
      );
  }