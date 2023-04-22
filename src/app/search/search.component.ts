import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, map, takeUntil } from 'rxjs';
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
export class SearchComponent extends Destoryable {

    @Input() dataSource: Observable<any[]>

    @Output() filterData = new EventEmitter<any[]>();

    searchCtrl: FormControl = new FormControl("");

    onKeypressSearch(event: KeyboardEvent) {
        if (event.key == "Enter") {
            this.search();
        }
    }

    search() {
        const searchValue: string = this.searchCtrl.value;

        this.dataSource.pipe(
            map(data => {
                if (searchValue.length == 0) {
                    this.filterData.emit(data)
                    return
                }

                const filteredData = data.filter(item => {

                    for (const prop in item) {
                        if (item[prop] && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                })

                return filteredData
            }),
            takeUntil(this.destroy$)
        ).subscribe(data => {
            this.filterData.emit(data);
        })
    }
}
