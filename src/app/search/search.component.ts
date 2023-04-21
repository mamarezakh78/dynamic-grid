import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

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
export class SearchComponent {

    @Input() dataSource: Observable<any[]>

    @Output() filteredData = new EventEmitter<any[]>();

    searchCtrl: FormControl = new FormControl("");

    onKeypressSearch(event: KeyboardEvent) {
        if (event.key == "Enter") {
            this.search();
        }
    }

    search() {
        const searchValue = this.searchCtrl.value;

        this.dataSource.pipe(
            map(data => {
                const filteredData = data.filter(item => {

                    for (const prop in item) {
                        if (item[prop] && item[prop].toString().toLowerCase().includes(searchValue.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                })

                console.log("Search");

                return filteredData
            })
        ).subscribe(_filteredData => {
            this.filteredData.emit(_filteredData);
        })
    }
}
