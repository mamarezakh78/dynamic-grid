import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Column, ActionOption as GridAction, GridRow } from './model/column.model';
import { Observable, ReplaySubject, map, of, shareReplay, takeUntil, tap } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { Destoryable } from '../tools/destroyable';

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
        ReactiveFormsModule,
        SearchComponent,
        Destoryable
    ]
})
export class GridComponent extends Destoryable implements OnInit, AfterViewInit {

    @Input() title: string = "Title";

    @Input() columns: (Column | any)[] = [];

    @Input() getDataSource: () => Observable<any[]>;

    @Input() hasMultiselect: boolean = true;

    @Input() hasSearch: boolean = true;

    @Input() groupAction: GridAction[] = [];

    @Input() primaryKey: string;

    private gridRowDataSource$: Observable<GridRow[]>

    cachedData$: ReplaySubject<any[]> = new ReplaySubject(1);

    filteredRows$: Observable<GridRow[]>;

    multiSelectedRows: { [key: number]: any } = {};

    pageSize: number = 10;
    pageIndex: number = 0;

    dataCount: number = 0;

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.initDataSource();
    }

    private initDataSource() {
        this.setCachData();

        this.gridRowDataSource$ = this.getMappedDataToGridRows();

        this.getFirstPage();
    }

    private setCachData() {
        this.getDataSource()
            .pipe(
                takeUntil(this.destroy$)
            ).subscribe(data => {
                this.cachedData$.next(data);
            })
    }

    private getMappedDataToGridRows(): Observable<GridRow[]> {
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
        this.filterRows(0);
    }

    private filterRows(from: number) {
        this.filteredRows$ = this.gridRowDataSource$.pipe(
            map(data => {

                const filteredList: GridRow[] = data.slice(from, from + this.pageSize);

                this.setStateOfRowSelect(filteredList);

                return filteredList
            }),
            tap(r => console.log(r))
        )
    }

    private setStateOfRowSelect(filteredList: GridRow[]) {
        filteredList.forEach(row => {
            if (this.multiSelectedRows[row.rowId]) {
                row.rowSelected = true;
                this.multiSelectedRows[row.rowId] = row;
            }
            else {
                row.rowSelected = false;
            }
        })
    }

    onChangePage(paginator: { pageIndex: number, pageSize: number }) {
        this.pageIndex = paginator.pageIndex;
        this.pageSize = paginator.pageSize;

        const startIndexOfPage: number = this.pageIndex * this.pageSize;

        this.filterRows(startIndexOfPage);
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
        this.gridRowDataSource$.pipe(
            map(data => {
                console.log("All Ckeck");

                return data.map(row => {
                    row.rowSelected = event.checked;

                    this.onChangeRowCheckBox(event, row);

                    return row
                })
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        this.filterRows(this.pageIndex * this.pageSize);
    }

    /**
     * 
     * @param searchFilteredData emitted filteredData from searchComponent
     */
    getSearchFilteredData(searchFilteredData: any[]) {
        this.gridRowDataSource$ = of(searchFilteredData).pipe(
            map(dataList => {
                this.dataCount = dataList.length;

                return dataList.map(data => this.createGridRow(data));
            })
        )

        this.getFirstPage();
    }

}
