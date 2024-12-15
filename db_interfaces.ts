// dbInterfaces.ts

export interface User {
    id?: number;
    username: string;
    password: string;
    creation_date?: Date;
  }
  
  export interface ImageFolder {
    id?: number;
    name: string;
  }
  
  export interface ImageCategory {
    id?: number;
    name: string;
  }
  
  export interface Image {
    id?: number;
    file_name: string;
    full_url: string;
    upload_date?: Date;
    category_id?: number;
    folder_id?: number;
  }
  
  export interface Article {
    id?: number;
    title: string;
    description: string;
    category?: string;
    info_text?: string;
    views?: number;
    publish_date?: Date;
    ready?: boolean;
    portfolio_ready?: boolean;
    type?: string;
    image?: string;
    article: string;
  }
  
  export interface Category {
    id?: number;
    name: string;
    submit_date?: Date;
  }
  
  export interface Chip {
    id?: number;
    name: string;
    description: string;
    submit_date?: Date;
  }
  
  export interface ArticleChip {
    article_id: number;
    chip_id: number;
  }
  
  export interface MDX {
    id?: number;
    file_name: string;
    full_url: string;
    upload_date?: Date;
  }
  