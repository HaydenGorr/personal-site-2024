export interface category {
    name: string;
    submit_date?: Date;
}

export interface db_category extends category {
    _id: string,
}