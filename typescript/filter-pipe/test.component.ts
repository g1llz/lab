import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Person } from './person';

@Component({
    selector: 'app-test',
    template: `

    <div>
        <input (keyup)="debounce.next($event.target.value)" placeholder="Search by name or email">
    </div>
    <div>
        <ul>
            <li *ngFor="let person of persons | customFilter: filter">{{ person.name }}
            </li>
        </ul>
    </div>
    `
})
export class TestComponent implements OnInit, OnDestroy {

    filter: string = '';
    debounce: Subject<string> = new Subject<string>();

    persons: Person[] = [
        { name: 'Mike Ross', email: 'mike@ross' },
        { name: 'Jessica Pearson', email: 'jessica@pearson' },
        { name: 'Brian Stwart', email: 'brian@brian'},
        { name: 'Jack Sparrow', email: 'jack@sparrow'}
    ];

    subs: Subscription[] = [];

    constructor() { }

    ngOnInit(): void {
        this.subs.push(
            this.debounce
                .pipe(debounceTime(300))
                .subscribe(filter => this.filter = filter)
        );   
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    
}