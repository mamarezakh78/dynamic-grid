import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientSidePaging, IFilterPageParam, IFilterPageResponse } from '../grid/model/client-side-paging.model';
import { IUser } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class SampleService {

    constructor() { }

    baseFilterService<T>(param: IFilterPageParam): Observable<IFilterPageResponse<T>> {
        return this.sampleUserApi(param) as Observable<IFilterPageResponse<T>>;
    }

    // Replace Api here
    private sampleUserApi(param: IFilterPageParam): Observable<IFilterPageResponse<IUser>> {

        let data: IUser[] = this.generateSampleUserData();

        // Filter by search value
        if (param.filterValue) {
            data = ClientSidePaging.filterSearchValue(data, param);
        }

        // Order
        if (param.orderKey) {
            data = ClientSidePaging.getSortedData(data, param);
        }

        // Response
        const response: IFilterPageResponse<IUser> = {
            data: data,
            dataCount: data?.length
        }

        // Paging
        response.data = data.slice(param.skip, param.skip + param.top);

        return of(response)
    } 

    generateSampleUserData(): IUser[] {
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