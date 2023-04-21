import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Column } from './model/column.model';
import { Observable, map, skip, take } from 'rxjs';
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
        PaginatorComponent
    ]
})
export class GridComponent implements OnInit, AfterViewInit {

    @Input() title: string = "Title";

    @Input() columns: Column[] = [];
    
    @Input() getDataSource: () => Observable<any[]>;

    @Input() hasMultiselect: boolean = true;

    dataSource$: Observable<any[]>

    filterData$: Observable<any[]>;

    pageSize: number = 10;
    pageIndex: number = 0;

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.dataSource$ = this.getDataSource();

        this.getFirstPage();
    }

    getFirstPage() {
        this.setFilterData(0);
    }

    setFilterData(from: number) {
        this.filterData$ = this.dataSource$.pipe(
            map(data => data.slice(from, from + this.pageSize))
        )
    }

    onChangePage(paginator: {pageIndex: number, pageSize: number}) {
        this.pageIndex = paginator.pageIndex;
        this.pageSize = paginator.pageSize;

        const startIndexOfPage: number = this.pageIndex * this.pageSize;

        this.setFilterData(startIndexOfPage);
    }

}
