export interface chip {
    name: string;
    description: string;
    submit_date?: string;
}

export interface db_chip extends chip {
    _id: string,
}