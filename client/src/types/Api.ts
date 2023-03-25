export interface IApiSuccessResponse<T> {
    status: "ok",
    msg: string,
    data? : T
}

export interface IApiErrorResponse {
    status: "error",
    msg: string
}

export type IApiResponse<T = any> = IApiSuccessResponse<T> | IApiErrorResponse