import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Column, ActionOption as GridAction, GridRow } from './model/column.model';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
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

    filterData$: Observable<GridRow[]>;

    multiSelectedRows: { [key: number]: any } = {};

    pageSize: number = 10;
    pageIndex: number = 0;

    dataCount: number = 0;

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.initDataSource();

        this.getFirstPage();
    }

    private initDataSource() {
        this.dataSource$ = this.getMapDataSourceToGridRows();
    }

    private getMapDataSourceToGridRows(): Observable<GridRow[]> {
        return this.getDataSource().pipe(
            shareReplay(),
            map(data => {

                this.dataCount = data.length;

                return data.map(row => this.createGridRow(row))
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
                return data.map(row => {
                    row.rowSelected = event.checked;

                    this.onChangeRowCheckBox(event, row);

                    return row
                })
            })
        ).subscribe();

        this.fetchFilterData(this.pageIndex * this.pageSize);

        console.log(this.multiSelectedRows);
    }

}
