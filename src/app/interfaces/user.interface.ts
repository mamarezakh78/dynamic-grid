export interface IUser {
    [key: string]: any;
    userId: number;
    username: string;
    email: string;
    phone: string;
    company: string;
}

export interface IFilterApiParam {
    skip: number;
    top: number;
    filterValue: string;
    orderDirection: 'asc' | 'desc';
    orderKey: string;
}

export interface IFilterApiResponse<T> {
    dataCount: number;
    data: T[];
}