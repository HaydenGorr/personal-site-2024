export interface file_on_drive {
    file_name: string;
    full_url: string;
    upload_date?: string;
}

export interface error {
    has_error: Boolean,
    error_message: string
}

export interface jwt_api {
    new_token: string;
    logged_in: Boolean;
}

export interface error {
    has_error: Boolean,
    error_message: string
}

export interface api_return_schema<T> {
    data: T
    error: error
}