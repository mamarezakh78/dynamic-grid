import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Column, ActionOption as GridAction, GridRow } from './model/column.model';
import { Observable, ReplaySubject, finalize, map, takeUntil } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { Destoryable } from '../tools/destroyable';
import { ClientSidePaging, IFilterPageResponse, IFilterPageParam } from './model/client-side-paging.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
        Destoryable,
        MatProgressBarModule
    ]
})
export class GridComponent extends Destoryable implements AfterViewInit {

    @Input() gridTitle: string = "Title";

    @Input() columns: (Column | any)[] = [];

    @Input() getDataSource: (apiParam: IFilterPageParam) => Observable<IFilterPageResponse<any>>;

    @Input() clientSidePagingDataSource: () => Observable<any[]>;

    @Input() hasMultiselect: boolean = true;

    @Input() hasSearch: boolean = true;

    @Input() groupAction: GridAction[] = [];

    @Input() primaryKey: string;

    @Input() isClientSidePaging: boolean = false;

    filteredRows: GridRow[];

    pageSize: number = 10;
    pageIndex: number = 0;

    dataCount: number = 0;

    isWait: boolean = false;

    private cachedData$: ReplaySubject<any> = new ReplaySubject(1);

    private multiSelectedRows: Map<number, GridRow> = new Map<number, GridRow>();

    private sortedColumn: Column;
    private sortDirection: 'asc' | 'desc' = 'asc';

    private searchedValue: string;

    public get getSortedColumnKey(): string {
        return this.sortedColumn?.key;
    }
    public get getSortDirection(): 'asc' | 'desc' {
        return this.sortDirection;
    }

    constructor(private cdkRef: ChangeDetectorRef) {
        super();
    }

    ngAfterViewInit() {
        this.checkPagingMode();
    }

    checkPagingMode() {
        if (this.isClientSidePaging) {
            this.setCacheData();
        }

        this.getData();
    }

    setCacheData() {
        this.clientSidePagingDataSource().pipe(
            takeUntil(this.destroy$)
        ).subscribe(data => {
            this.cachedData$.next(data)
            this.cachedData$.complete();
        })
    }

    private getData() {

        const apiParam: IFilterPageParam = this.getApiParams();

        let data$: Observable<IFilterPageResponse<any>> = this.isClientSidePaging ? ClientSidePaging.paging(this.cachedData$, apiParam) : this.getDataSource(apiParam);

        this.isWait = true;
        this.cdkRef.detectChanges()

        data$.pipe(
            takeUntil(this.destroy$),
            map(data => {
                this.dataCount = data.dataCount;

                return data.data
            }),
            finalize(() => this.isWait = false)
        ).subscribe(data => {
            this.filteredRows = this.mapDataToGridRow(data);
        })
    }

    private getApiParams(): IFilterPageParam {
        return {
            skip: this.pageIndex * this.pageSize,
            top: this.pageSize,
            filterValue: this.searchedValue || "",
            orderKey: this.sortedColumn?.key,
            orderDirection: this.sortDirection
        }
    }

    private mapDataToGridRow(dataList: any[]): GridRow[] {
        return dataList.map(row => {
            let gridRow = this.createGridRow(row);

            gridRow.rowSelected = this.setStateOfRowSelect(gridRow);

            return gridRow
        });
    }

    private createGridRow(row: any): GridRow {
        return {
            data: row,
            rowId: row[this.primaryKey],
            rowSelected: false
        };
    }

    private setStateOfRowSelect(row: GridRow): boolean {
        if (this.multiSelectedRows.has(row.rowId)) {
            row.rowSelected = this.multiSelectedRows.get(row.rowId)?.rowSelected;
            this.multiSelectedRows.set(row.rowId, row);
        }
        else {
            row.rowSelected = false;
        }

        return row.rowSelected || false
    }

    getSelectedRowsData(): GridRow[] {
        return [...this.multiSelectedRows.values()]
            .filter((row: GridRow) => row.rowSelected)
            .map(row => row.data);
    }

    onChangePage(paginator: { pageIndex: number, pageSize: number }) {
        this.pageIndex = paginator.pageIndex;
        this.pageSize = paginator.pageSize;

        this.getData();
    }

    onChangeRowCheckBox(event: MatCheckboxChange, row: GridRow) {
        row.rowSelected = event.checked;

        this.multiSelectedRows.set(row.rowId, row);
    }

    toggleSelectAllRows(event: MatCheckboxChange) {
        if (!event.checked) {
            this.multiSelectedRows.clear();
        }

        this.cachedData$.asObservable().pipe(
            map((dataList: any[]) => {
                dataList.forEach(row => this.onChangeRowCheckBox(event, this.createGridRow(row)));
                
                return dataList
            })
        ).subscribe(() => this.getData())
    }

    getSearchValue(searchValue: string) {
        this.pageIndex = 0;

        this.searchedValue = searchValue;

        this.getData();
    }

    onColumnHeaderClick(column: Column) {
        if (!column.hasSort) {
            return
        }

        if (this.sortedColumn === column) {
            this.toggleSortDirection();
        } else {
            this.setNewSortConfig(column);
        }

        this.getData();
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
