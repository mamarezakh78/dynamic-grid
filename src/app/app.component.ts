import { Component } from '@angular/core';
import { ActionColumn, ActionOption, Column } from './grid/model/column.model';
import { Observable, delay, of } from 'rxjs';
import { IUser, SampleData } from './sampleData';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    groupAction: ActionOption[] = [
        { label: "Edit", onClick: (row) => alert("Edited: " + row.userId), },
        { label: "Delete", onClick: (row) => alert("Deleted: " + row.userId), },
        { label: "View", onClick: (row) => alert("Viewed: " + row.userId), }
    ]

    sampleColumns: Column[] = [
        new Column({ label: "User ID", key: "userId" }),
        new Column({ label: "Username", key: "username" }),
        new Column({ label: "Email", key: "email" }),
        new Column({ label: "Phone", key: "phone" }),
        new Column({ label: "Company", key: "company" }),
        new ActionColumn({ label: "Action", actionList: this.groupAction }),
    ]

    getDataFromApi = (): Observable<IUser[]> => {
        return of(SampleData.generateSampleUserData())
            .pipe(
                delay(500)
            )
    }
}
