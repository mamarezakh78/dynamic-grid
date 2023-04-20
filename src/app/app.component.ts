import { Component } from '@angular/core';
import { Column } from './grid/model/column.model';
import { Observable, delay, of } from 'rxjs';
import { IUser, SampleData } from './sampleData';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    sampleColumns: Column[] = [
        new Column({ label: "User ID", key: "userId" }),
        new Column({ label: "Username", key: "username" }),
        new Column({ label: "Email", key: "email" }),
        new Column({ label: "Phone", key: "phone" }),
        new Column({ label: "Company", key: "company" }),
    ]

    getDataFromApi = (): Observable<IUser[]> => {
        return of(SampleData.generateSampleUserData())
            .pipe(
                delay(500)
            )
    }
}
