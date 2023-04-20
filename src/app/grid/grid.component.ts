import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
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
export class GridComponent {

    @Input() title: string = "Title";

    

}
