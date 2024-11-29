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

export interface file_in_cms_drive {
    filename: string
}

export interface api_return_schema<T> {
    data: T
    error: error
}

export interface image {
    _id?: number;
    file_name: string;
}

export interface mdx {
    _id?: number;
    file_name: string;
}

export interface error {
    has_error: Boolean,
    error_message: string
}

export interface jwt_api {
    new_token: string;
    logged_in: Boolean;
}