export interface category {
    _id?: number;
    name: string;
}

export interface chip {
    _id?: number;
    name: string;
    description: string;
}

export interface article {
    _id?: number;
    article: string;
    title: string;
    desc: string;
    infoText: string;
    chips: string[],
    category: string,
    source: string;
    views: number;
    publishDate: Date,
    ready: Boolean,
    portfolioReady: Boolean,
    image: string,
}

export interface file_on_drive {
    file_name: string;
    full_url: string;
}

export interface api_return_schema<T> {
    data: T
    error: error
}

export interface image  extends file_on_drive {
    _id?: number;
}

export interface mdx  extends file_on_drive {
    _id?: number;
}

export interface error {
    has_error: Boolean,
    error_message: string
}

export interface jwt_api {
    new_token: string;
    logged_in: Boolean;
}