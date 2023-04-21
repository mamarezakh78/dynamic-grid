import { Component, ViewChild } from '@angular/core';
import { ActionColumn, ActionOption, Column } from './grid/model/column.model';
import { Observable, delay, of, tap } from 'rxjs';
import { IUser, SampleData } from './sampleData';
import { GridComponent } from './grid/grid.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild('grid') grid: GridComponent;

    groupAction: ActionOption[] = [
        { label: "Delete", onClick: () => console.log(this.grid.multiSelectedRows) }
    ]

    sampleColumns: Column[] = [
        new Column({ label: "User ID", key: "userId" }),
        new Column({ label: "Username", key: "username" }),
        new Column({ label: "Email", key: "email" }),
        new Column({ label: "Phone", key: "phone" }),
        new Column({ label: "Company", key: "company" }),
        new ActionColumn({
            label: "Action", actionList: [
                { label: "Edit", onClick: (row) => alert("Edited: " + row.userId), },
                { label: "Delete", onClick: (row) => alert("Deleted: " + row.userId), },
                { label: "View", onClick: (row) => alert("Viewed: " + row.userId) }
            ]
        }),
    ]

    getDataFromApi = (): Observable<IUser[]> => {
        return of(SampleData.generateSampleUserData())
            .pipe(
                delay(500),
                tap(() => console.log("Fetch Data"))
            )
    }
}
