import { Component, ViewChild } from '@angular/core';
import { ActionColumn, ActionOption, Column } from './grid/model/column.model';
import { GridComponent } from './grid/grid.component';
import { SampleService } from './services/sample.service';
import { Observable, delay, map, of } from 'rxjs';
import { IFilterPageParam, IFilterPageResponse } from './grid/model/client-side-paging.model';
import { IUser } from './interfaces/user.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild('grid') grid: GridComponent;

    constructor(private sampleService: SampleService) {

    }

    groupAction: ActionOption[] = [
        { label: "Delete", onClick: () => console.log(this.grid.getSelectedRowsData()) }
    ]

    sampleColumns: Column[] = [
        new Column({ label: "User ID", key: "userId", hasSort: true }),
        new Column({ label: "Username", key: "username", hasSort: true }),
        new Column({ label: "Email", key: "email" }),
        new Column({ label: "Phone", key: "phone", hasSort: true }),
        new Column({ label: "Company", key: "company" }),
        new ActionColumn({
            label: "Action", actionList: [
                { label: "Edit", onClick: (row) => alert("Edited: " + row.userId), },
                { label: "Delete", onClick: (row) => alert("Deleted: " + row.userId), },
                { label: "View", onClick: (row) => alert("Viewed: " + row.userId) }
            ]
        }),
    ]

    getDataFromApi = (apiParam: IFilterPageParam): Observable<IFilterPageResponse<IUser>> => {
        return this.sampleService.baseFilterService<IUser>(apiParam).pipe(delay(600))
    }

    getStaticData = () => of(this.sampleService.generateSampleUserData()).pipe(
        delay(600),
        map(res => {
            setTimeout(() => {
                res.push({
                    userId: 95,
                    username: "Mamareza",
                    email: "mamareza@gmail.com",
                    phone: "0935",
                    company: "i4twins"
                })
            }, 5000);

            return res
        })
    );
}
