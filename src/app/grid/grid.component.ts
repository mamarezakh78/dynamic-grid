import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Column, ActionOption as GridAction, GridRow } from './model/column.model';
import { Observable, ReplaySubject, map, of, shareReplay, tap } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
    standalone: true,
    selector: 'grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css'],
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule,
        MatCheckboxModule,
        PaginatorComponent,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class GridComponent implements OnInit, AfterViewInit {

    @Input() title: string = "Title";

    @Input() columns: (Column | any)[] = [];

    @Input() getDataSource: () => Observable<any[]>;

    @Input() hasMultiselect: boolean = true;

    @Input() groupAction: GridAction[] = [];

    @Input() primaryKey: string;

    private dataSource$: Observable<GridRow[]>

    private cachedData$: ReplaySubject<any[]> = new ReplaySubject(1);

    filterData$: Observable<GridRow[]>;

    multiSelectedRows: { [key: number]: any } = {};

    pageSize: number = 10;
    pageIndex: number = 0;

    dataCount: number = 0;

    searchCtrl: FormControl = new FormControl("");

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.initDataSource();
    }

    private initDataSource() {
        this.setCachData();

        this.dataSource$ = this.getMapDataSourceToGridRows();

        this.getFirstPage();
    }

    setCachData() {
        this.getDataSource().subscribe(data => {
            this.cachedData$.next(data);
        })
    }

    private getMapDataSourceToGridRows(): Observable<GridRow[]> {
        return this.cachedData$.pipe(
            shareReplay(),
            map(data => {

                console.log("getMapDataSourceToGridRows");

                this.dataCount = data.length;

                return data.map(row => this.createGridRow(row));
            })
        )
    }

    private createGridRow(row: any): GridRow {
        return {
            data: row,
            rowId: row[this.primaryKey],
            rowSelected: false
        };
    }

    private getFirstPage() {
        this.fetchFilterData(0);
    }

    private fetchFilterData(from: number) {
        this.filterData$ = this.dataSource$.pipe(
            map(data => {

                const filteredList: GridRow[] = data.slice(from, from + this.pageSize);

                filteredList.forEach(row => {
                    if (this.multiSelectedRows[row.rowId]) {
                        row.rowSelected = true;
                        this.multiSelectedRows[row.rowId] = row;
                    }
                    else {
                        row.rowSelected = false;
                    }
                })

                return filteredList
            }),
            tap(r => console.log(r))
        )
    }

    onChangePage(paginator: { pageIndex: number, pageSize: number }) {
        this.pageIndex = paginator.pageIndex;
        this.pageSize = paginator.pageSize;

        const startIndexOfPage: number = this.pageIndex * this.pageSize;

        this.fetchFilterData(startIndexOfPage);
    }

    onChangeRowCheckBox(event: MatCheckboxChange, row: GridRow) {
        if (event.checked) {
            this.multiSelectedRows[row.rowId] = row.data;
        }
        else {
            delete this.multiSelectedRows[row.rowId];
        }
    }

    onChangeAllRowsCheckbox(event: MatCheckboxChange) {
        this.dataSource$.pipe(
            map(data => {
                console.log("All Ckeck");

                return data.map(row => {
                    row.rowSelected = event.checked;

                    this.onChangeRowCheckBox(event, row);

                    return row
                })
            })
        ).subscribe();

        this.fetchFilterData(this.pageIndex * this.pageSize);
    }

    onKeypressSearch(event: KeyboardEvent) {
        if (event.key == "Enter") {
            this.search();
        }
    }

    search() {
        const searchValue = this.searchCtrl.value;

        this.cachedData$.pipe(
            map(data => {
                const filteredData = data.filter(item => {

                    for (const prop in item) {
                        if (item[prop] && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                })

                console.log("Search");

                this.dataCount = filteredData.length;

                return filteredData.map(row => this.createGridRow(row));
            })
        ).subscribe(filteredData => {
            this.dataSource$ = of(filteredData);
            this.getFirstPage();
        });
    }

}
