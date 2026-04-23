export interface ApiSuccessResponse<T = any> { success: true; message: string; data: T; };

export interface ApiErrorResponse { success: false; error: string; code: string; };