import { Observable, map } from "rxjs";

export class ClientSidePaging {

    static paging(data$: Observable<any[]>, param: IFilterPageParam): Observable<IFilterPageResponse<any>> {

        return data$.pipe(
            map(data => {
                // Filter by search value
                if (param.filterValue) {
                    data = this.filterSearchValue(data, param);
                }

                // Order
                if (param.orderKey) {
                    data = this.getSortedData(data, param);
                }

                // Response
                const response: IFilterPageResponse<any> = {
                    data: data,
                    dataCount: data?.length
                }

                // paging
                response.data = data.slice(param.skip, param.skip + param.top);

                return response
            })
        )
    }

    static filterSearchValue(data: any[], param: IFilterPageParam): any[] {
        return data.filter(user => {

            for (const prop in user) {
                if (user[prop] && user[prop].toString().toLowerCase().includes(param?.filterValue?.toLowerCase())) {
                    return true;
                }
            }
            return false;
        })
    }

    static getSortedData(dataList: any[], param: IFilterPageParam): any[] {

        dataList = dataList.sort((a, b) => {
            const aVal = a[param.orderKey];
            const bVal = b[param.orderKey];

            if (aVal < bVal) return param.orderDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return param.orderDirection === 'asc' ? 1 : -1;

            return 0;
        })

        return dataList;
    }
}


export interface IFilterPageParam {
    skip: number;
    top: number;
    filterValue: string;
    orderDirection: 'asc' | 'desc';
    orderKey: string;
}

export interface IFilterPageResponse<T> {
    dataCount: number;
    data: T[];
}