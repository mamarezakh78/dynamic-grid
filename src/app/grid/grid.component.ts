import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Column } from './model/column.model';
import { Observable } from 'rxjs';
@Component({
    standalone: true,
    selector: 'grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css'],
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule,
        MatCheckboxModule
    ]
})
export class GridComponent implements OnInit {

    @Input() title: string = "Title";

    @Input() hasMultiselect: boolean = true;

    @Input() columns: Column[] = [];

    @Input() getDataSource: () => Observable<any[]>;

    filterData$: Observable<any[]>;

    ngOnInit(): void {
        this.setFilterData();
    }

    setFilterData() {
       this.filterData$ = this.getDataSource();
    }


}
