import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.css'],
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule
    ]
})
export class PaginatorComponent implements OnInit {

    @Input() dataLength: number;

    @Input() pageSize: number;

    @Output() onChangePage = new EventEmitter<{ pageIndex: number, pageSize: number }>();

    pageSizeOptions: number[] = [10, 25, 50, 100];

    pageList: number[] = [];

    pageCount: number;

    activePageIndex: number = 0;

    ngOnInit(): void {
        this.generatePageList();
    }

    generatePageList() {
        this.pageCount = Math.ceil(this.dataLength / this.pageSize);

        for (let i = 0; i < this.pageCount; i++) {
            this.pageList.push(i)
        }
    }

    changePageIndex(pageIndex: number) {
        if (pageIndex < 0 || pageIndex >= this.pageCount || pageIndex == this.activePageIndex) {
            return
        }

        this.activePageIndex = pageIndex;

        this.onChangePage.emit({ pageIndex: this.activePageIndex, pageSize: this.pageSize });
    }

    changePageSize(newPageSize: number) {
        if (newPageSize == this.pageSize) {
            return
        }

        this.pageSize = newPageSize;

        this.pageList = [];

        this.activePageIndex = null as any;

        this.generatePageList();

        this.changePageIndex(0);
    }


}
