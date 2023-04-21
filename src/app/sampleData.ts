export class SampleData {

    static generateSampleUserData(): IUser[] {

        let sampleData: IUser[] = [];

        for (let i = 0; i < 30; i++) {
            const user: IUser = {
                userId: i + 1,
                username: "Mohamed Ahmed Nooh",
                email: "mohamed124@gmail.com",
                phone: "09876545482",
                company: "VF DE, T-mobile, VF Cairo, CF Snapp"
            }

            sampleData.push(user);
        }

        return sampleData;
    }
}


export interface IUser {
    userId: number;
    username: string;
    email: string;
    phone: string;
    company: string;
}