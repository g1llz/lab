import { Pipe, PipeTransform } from "@angular/core";
import { Person } from './person';

@Pipe({ name: 'customFilter' })
export class FilterPipe implements PipeTransform {

    transform(array: Person[], value: string) {
        value = value.trim().toLowerCase();

        if(value) {
            return array.filter(item => 
                item.name.toLowerCase().includes(value) ||
                item.email.toLowerCase().includes(value)); 
        } else {
            return array;
        }
    }
}