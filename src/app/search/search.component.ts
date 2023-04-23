import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, debounceTime, distinct, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs';
import { Destoryable } from '../tools/destroyable';

@Component({
    standalone: true,
    selector: 'search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class SearchComponent extends Destoryable implements OnInit {

    @Input() dataSource: Observable<any[]>

    @Output() filterData = new EventEmitter<any[]>();

    searchCtrl: FormControl = new FormControl("");

    ngOnInit(): void {
        this.listenOnSearchInput();
    }

    listenOnSearchInput() {
        this.searchCtrl.valueChanges.pipe(
            debounceTime(600),
            distinctUntilChanged()
        ).subscribe(() => {
            this.search();
        })
    }

    onKeypressSearch(event: KeyboardEvent) {
        if (event.key == "Enter") {
            this.search();
        }
    }

    search() {
        this.dataSource.pipe(
            map(data => {

                const filteredData = this.getFilteredDataBySearchValue(data);

                return filteredData
            }),
            takeUntil(this.destroy$)
        ).subscribe(data => {
            this.filterData.emit(data);
        })
    }

    getFilteredDataBySearchValue(data: any[]): any[] {
        const searchValue: string = this.searchCtrl.value;

        if (searchValue.length == 0) {
            this.filterData.emit(data)
            return data
        }

        return data.filter(item => {

            for (const prop in item) {
                if (item[prop] && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                    return true;
                }
            }
            return false;
        })
    }
}
