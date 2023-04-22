import { Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    standalone: true,
    template: ""
})
export class Destoryable {

    protected destroy$ = new Subject();

    ngOnDestroy() {
        this.destroy$.next('');
        this.destroy$.complete();
    }
}