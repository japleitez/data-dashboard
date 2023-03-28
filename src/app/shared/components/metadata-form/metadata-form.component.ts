import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MetadataFormData } from '../model/metadata-form-model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-metadata-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata-form.component.html',
})
export class MetadataFormComponent implements OnChanges {

    @Input() metadata: MetadataFormData;
    @Input() singleComponent: boolean = true;
    @Output() registerFormData = new EventEmitter<MetadataFormComponent>();

    public metadataFormGroup: FormGroup = this.fb.group({});
    private maxNumberOfValues = 20;

    constructor(private fb: FormBuilder) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.metadata !== undefined) {
            this.createControls(this.metadata);
            this.registerFormData.emit(this);
        }
    }

    createControls(md: MetadataFormData) {
        const controlArray: FormControl[] = [];
        for (let i = 0; i < md.data.values.length; i++) {
            controlArray[i] = this.buildControl();
        }
        this.metadataFormGroup.addControl('key', this.buildControl());
        this.metadataFormGroup.addControl('values', this.fb.array(controlArray));
    }

    getMetadataId() {
        if (this.metadata !== undefined) {
            return this.metadata.id;
        }
        return 'none';
    }

    addValue() {
        if (!this.hasReachedMaxValuesSize()) {
            this.getFormArray('values').push(this.buildControl());
        }
    }

    removeValue(index: number) {
        this.getFormArray('values').removeAt(index);
    }

    hasValues(): boolean {
        return this.getFormArray('values').length > 1;
    }

    hasReachedMaxValuesSize(): boolean {
        return this.getFormArray('values').length >= this.maxNumberOfValues;
    }

    hasMetadata(): boolean {
        return this.metadata !== undefined;
    }

    getFormArrayControls() {
        return this.getFormArray('values').controls as FormControl[];
    }

    getFormArray(id: string) {
        return this.metadataFormGroup.get('values') as FormArray;
    }

    private buildControl() {
        return this.fb.control('', Validators.required) as FormControl;
    }

}
