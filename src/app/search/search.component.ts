import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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

    // @Input() dataSource: Observable<any[]>

    // @Output() filterData = new EventEmitter<any[]>();

    @Output() searchValue = new EventEmitter<string>();

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
        this.searchValue.emit(this.searchCtrl.value);
    }

}
