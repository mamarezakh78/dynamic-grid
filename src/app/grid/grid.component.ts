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

    private cachedData$: ReplaySubject<any[]> = new ReplaySubject(1);

    public get getCachedData(): ReplaySubject<any[]> {
        return this.cachedData$;
    }

    filteredRows$: Observable<GridRow[]>;

    multiSelectedRows: { [key: number]: any } = {};

    pageSize: number = 10;
    pageIndex: number = 0;

    dataCount: number = 0;

    private sortedColumn: Column;
    private sortDirection: 'asc' | 'desc' = 'asc';

    public get getSortedColumnKey(): string {
        return this.sortedColumn?.key;
    }
    public get getSortDirection(): 'asc' | 'desc' {
        return this.sortDirection;
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.initDataSource();
    }

    private initDataSource() {
        this.setCachData();

        this.getGridRowData();

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

    /**
     * @param filterData filterData is an optional parameter that is array of 'Api Model' type.
     *                   If "filterData" is provided, the method will use it to filter the cached data, otherwise, the cached data will be used.
     * @returns 
     * @description this method responsible for getting the data for a grid, filtering and sorting the data as needed,
     *              and transforming the data into an array of "GridRow" objects that can be displayed in the grid.
     */
    private getGridRowData(filterData?: any[]): Observable<GridRow[]> {
        const data$ = filterData ? of(filterData) : this.cachedData$;

        return this.gridRowDataSource$ = data$.pipe(
            shareReplay(),
            map(dataList => {
                this.dataCount = dataList.length;

                const sortedDataList = this.getSortedData(dataList);

                return this.mapDataToGridRow(sortedDataList);
            })
        )
    }

    private getSortedData(dataList: any[]): any[] {
        if (this.sortedColumn) {
            dataList = dataList.sort((a, b) => {
                const aVal = a[this.sortedColumn.key];
                const bVal = b[this.sortedColumn.key];

                if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;

                return 0;
            });
        }

        return dataList;
    }

    private mapDataToGridRow(dataList: any[]): GridRow[] {
        return dataList.map(row => this.createGridRow(row));
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
            })
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

        this.refreshCurrentPage();
    }

    private refreshCurrentPage() {
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

    toggleSelectAllRows(event: MatCheckboxChange) {
        this.getGridRowData().pipe(
            map(data => {
                return data.map(row => {
                    row.rowSelected = event.checked;

                    this.onChangeRowCheckBox(event, row);

                    return row
                })
            }),
            takeUntil(this.destroy$)
        ).subscribe()

        this.refreshCurrentPage();
    }

    /**
     * 
     * @param searchFilteredData emitted filteredData from searchComponent
     */
    getSearchFilteredData(searchFilteredData: any[]) {
        this.getGridRowData(searchFilteredData);

        this.getFirstPage();
    }

    sort(column: Column) {
        if (!column.hasSort) {
            return
        }

        if (this.sortedColumn === column) {
            this.toggleSortDirection();
        } else {
            this.setNewSortConfig(column);
        }

        this.getGridRowData();

        this.refreshCurrentPage();
    }

    private toggleSortDirection() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    private setNewSortConfig(column: Column) {
        this.sortedColumn = column;
        this.sortDirection = 'asc';
    }

    trackByFn(idx: number, row: GridRow) {
        return row.rowId;
    }

}
