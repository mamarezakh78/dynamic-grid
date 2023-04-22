import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SampleService {

    sampleData: IUser[] = [];

    constructor() { }

    getSampleUserData(): Observable<IUser[]> {
        this.generateSampleUserData();

        return of(this.sampleData);
    }

    private generateSampleUserData() {

        for (let i = 0; i < 27; i++) {
            const user: IUser = {
                userId: i + 1,
                username: "Mohamed Ahmed Nooh",
                email: "mohamed124@gmail.com",
                phone: "09876545482",
                company: "VF DE, T-mobile, VF Cairo, CF Snapp"
            }

            this.sampleData.push(user);
        }
    }
}


export interface IUser {
    userId: number;
    username: string;
    email: string;
    phone: string;
    company: string;
}