import { Component, OnInit, Input, SimpleChanges, OnChanges } from "@angular/core";

@Component({
    selector: 'mc-form-message',
    template: `
    <small class="text-{{ style?.class }} d-block mt-2">
        <i class="fa fa-{{ style?.icon }}"></i> {{ text }}
    </small>`
})
export class FormMessageComponent implements OnInit, OnChanges {

    text : string;
    style: object;

    @Input() property: string;
    @Input() error: any;

    ngOnInit(): void {
        this.whichText(this.error);

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.whichText(changes.error.currentValue);
    }

    whichText(value: object) {

        if (value !== null) {
            this.style = { icon: 'times', class: 'danger'};

            value['required'] ?
                this.text = `${this.property} is required` : '';
            value['minlength'] ?
                this.text = `${this.property} is too short` : '';
            value['email'] ?
                this.text = `Invalid ${this.property.toLowerCase()}` : '';
            value['maxlength'] ?
                this.text = `${this.property} is too long` : '';

        } else {
            this.text  = '';
            this.style = { icon: 'check', class: 'success'};
        }

    }

}