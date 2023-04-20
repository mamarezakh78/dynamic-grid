import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    standalone: true,
    selector: 'paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.css'],
    imports: [
        CommonModule
    ]
})
export class PaginatorComponent implements OnInit {

    @Input() dataLength: number;

    @Input() pageSize: number;

    @Output() onChangePage = new EventEmitter<number>();

    pageSizeOptions: number[] = [10, 25, 50, 100];

    pageList: number[] = [];

    pageCount: number;

    ngOnInit(): void {
        this.generatePageList();
    }

    generatePageList() {
        this.pageCount = Math.ceil(this.dataLength / this.pageSize);

        for (let i = 1; i <= this.pageCount; i++) {
            this.pageList.push(i)
        }
    }

    onClickPageNumber(pageIndex: number) {
        this.onChangePage.emit(pageIndex - 1);
    }


}
