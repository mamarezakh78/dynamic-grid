import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Column, ActionOption as GridAction, GridRow } from './model/column.model';
import { Observable, map, takeUntil } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { Destoryable } from '../tools/destroyable';
import { IFilterApiParam, IFilterApiResponse } from '../interfaces/user.interface';

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
export class GridComponent extends Destoryable implements AfterViewInit {

    @Input() gridTitle: string = "Title";

    @Input() columns: (Column | any)[] = [];

    @Input() getDataSource: (apiParam: IFilterApiParam) => Observable<IFilterApiResponse<any>>;

    @Input() hasMultiselect: boolean = true;

    @Input() hasSearch: boolean = true;

    @Input() groupAction: GridAction[] = [];

    @Input() primaryKey: string;

    filteredRows: GridRow[];

    private multiSelectedRows: Map<number, GridRow> = new Map<number, GridRow>();

    pageSize: number = 10;
    pageIndex: number = 0;

    dataCount: number = 0;

    isCheckAll: boolean = false;

    private sortedColumn: Column;
    private sortDirection: 'asc' | 'desc' = 'asc';

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
        this.getData();
    }

    private getData(filterVaue?: string) {

        const apiParam: IFilterApiParam = this.getApiParams(filterVaue);

        this.getDataSource(apiParam)
            .pipe(
                takeUntil(this.destroy$),
                map(data => {
                    this.dataCount = data.dataCount;

                    return data.data
                })
            ).subscribe(data => {
                this.filteredRows = this.mapDataToGridRow(data);
                this.cdkRef.detectChanges();
            })
    }

    private getApiParams(filterVaue?: string): IFilterApiParam {
        return {
            skip: this.pageIndex * this.pageSize,
            top: this.pageSize,
            filterValue: filterVaue || "",
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
        else if (this.isCheckAll && !this.multiSelectedRows.has(row.rowId)) {
            row.rowSelected = true;
            this.multiSelectedRows.set(row.rowId, row);
        } else {
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

        this.isCheckAll = event.checked;

        this.filteredRows.forEach(row => {
            this.onChangeRowCheckBox(event, row);
        })
    }

    getSearchValue(searchValue: string) {
        this.pageIndex = 0;

        this.getData(searchValue)
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
