import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class SampleService {

    sampleData: IUser[] = [];

    constructor() { }

    getSampleUserData(): Observable<IUser[]> {
        return of(this.generateSampleUserData());
    }

    private generateSampleUserData(): IUser[] {
        const sampleData: IUser[] = [];

        for (let i = 0; i < 33; i++) {
            const user: IUser = {
                userId: i + 1,
                username: "Mohamed Ahmed Nooh",
                email: "mohamed124@gmail.com",
                phone: "09876545482",
                company: "VF DE, T-mobile, VF Cairo, CF Snapp"
            }

            this.sampleData.push(user);
        }

        return sampleData
    }
}