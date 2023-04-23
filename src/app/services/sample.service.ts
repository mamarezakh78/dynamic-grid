import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IFilterApiParam, IFilterApiResponse, IUser } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class SampleService {

    constructor() { }

    baseFilterService<T>(param: IFilterApiParam): Observable<IFilterApiResponse<T>> {
        return this.sampleUserApi(param) as Observable<IFilterApiResponse<T>>;
    }

    // Replace Api here
    private sampleUserApi(param: IFilterApiParam): Observable<IFilterApiResponse<IUser>> {

        let data: IUser[] = this.generateSampleUserData();

        // Filter by search value
        if (param.filterValue) {
            data = this.filterSearchValue(data, param);
        }

        // Order
        if (param.orderKey) {
            data = this.getSortedData(data, param);
        }

        // Response
        const response: IFilterApiResponse<IUser> = {
            data: data,
            dataCount: data?.length
        }

        // Paging
        response.data = data.slice(param.skip, param.skip + param.top);

        return of(response)
    }

    private filterSearchValue(data: IUser[], param: IFilterApiParam): IUser[] {
        return data.filter(user => {

            for (const prop in user) {
                if (user[prop] && user[prop].toString().toLowerCase().includes(param?.filterValue?.toLowerCase())) {
                    return true;
                }
            }
            return false;
        })
    }

    private getSortedData(dataList: any[], param: IFilterApiParam): any[] {

        dataList = dataList.sort((a, b) => {
            const aVal = a[param.orderKey];
            const bVal = b[param.orderKey];

            if (aVal < bVal) return param.orderDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return param.orderDirection === 'asc' ? 1 : -1;

            return 0;
        })

        return dataList;
    }

    private generateSampleUserData(): IUser[] {
        const sampleData: IUser[] = [];

        for (let i = 0; i < 16; i++) {
            const user: IUser = {
                userId: i + 1,
                username: "Mohamed Ahmed Nooh",
                email: "mohamed124@gmail.com",
                phone: "09876545482",
                company: "VF DE, T-mobile, VF Cairo, CF Snapp"
            }

            sampleData.push(user);
        }

        return sampleData
    }
}