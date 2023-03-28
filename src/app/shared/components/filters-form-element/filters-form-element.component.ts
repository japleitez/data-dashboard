import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JsonFormParameter } from '../model/url-filter-form.model';

@Component({
    selector: 'app-filter-element-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './filters-form-element.component.html',
})

export class FiltersFormElementComponent implements OnChanges {

    public static getValidators(param: JsonFormParameter) {
        const validatorsToAdd = [];
        validatorsToAdd.push(Validators.nullValidator);
        for (const [key, value] of Object.entries(param.type)) {
            switch (key) {
                case 'minimum':
                    validatorsToAdd.push(Validators.min(value));
                    break;
                case 'maximum':
                    validatorsToAdd.push(Validators.max(value));
                    break;
                case 'required':
                    if (value) {
                        validatorsToAdd.push(Validators.required);
                    }
                    break;
                case 'minLength':
                    validatorsToAdd.push(Validators.minLength(value));
                    break;
                case 'maxLength':
                    validatorsToAdd.push(Validators.maxLength(value));
                    break;
                case 'pattern':
                    validatorsToAdd.push(Validators.pattern(value));
                    break;
                default:
                    break;
            }
        }
        return validatorsToAdd;
    }

    @Input() param: JsonFormParameter;
    @Input() paramObjId: string = '';
    @Input() objectId: string;
    @Input() public formUrlFilterConfig: FormGroup;
    @Input() public values: any;
    @Input() public objIndex: any = '_';

    @Output() formUrlFilterConfigChange = new EventEmitter();

    public defaultFilterName = '';
    public translationKeyFilter = '';

    public formUrlList: string = '';
    public filterID: string = '';

    constructor(private fb: FormBuilder) {
    }

    public getValuesArray(objectId: string, index: number) {
        if (this.values === undefined) {
            return;
        }

        if (this.param.type.type === 'object') {
            return this.values[objectId];
        } else {
            if (this.values.length <= index) {
                return;
            }
            if (this.values[index][objectId] !== undefined) {
                return this.values[index][objectId];
            } else {
                return this.values[index];
            }
        }
    }

    public getValues(objectId: string) {
        if (this.values === undefined) {
            return;
        }
        return (this.values[objectId] === undefined) ? this.values : this.values[objectId];
    }

    public getFormByID(objectId: string) {
        return this.formUrlFilterConfig.get(objectId) as FormGroup;
    }

    public getFormByIDandIndex(objectId: string, index: number) {
        return this.formUrlFilterConfig.get(objectId).get(index + '') as FormGroup;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.param !== undefined) {
            this.createForm(this.param);
        }
    }

    public createForm(parametr: JsonFormParameter) {
        switch (parametr.type.type) {
            case 'array':
                this.fillArrayTypeForm(parametr);
                break;
            case 'object':
                this.fillObjectForm(parametr);
                break;
            default:
                this.fillSimpleTypeForm(parametr);
                break;
        }
    }

    fillObjectForm(param: JsonFormParameter) {
        let objectFormGroup: FormGroup = this.fb.group({});
        if (this.objectId) {
            if (null === this.getObjectFormGroup(this.objectId)) {
                this.formUrlFilterConfig.addControl(param.id, objectFormGroup);
            } else {
                this.getObjectFormGroup(this.objectId).addControl(param.id, objectFormGroup);
            }
        } else {
            this.formUrlFilterConfig.addControl(param.id, objectFormGroup);
        }
    }

    fillArrayTypeForm(param: JsonFormParameter) {
        let arrSize = Math.max(param.type.minArrayLength, (this.values === undefined) ? 0 : this.values.length);
        if (param.type.arrayType === 'object') {
            const formGroupArray: FormGroup[] = [];
            for (let i = 0; i < arrSize; i++) {
                formGroupArray[i] = this.fb.group({});
            }
            this.formUrlFilterConfig.addControl(param.id, this.fb.array(formGroupArray));
        } else {
            const controlArray: FormControl[] = [];
            for (let i = 0; i < arrSize; i++) {
                controlArray[i] = this.buildControl(param, (this.values === undefined) ? '' : this.values[i]);
            }
            this.formUrlFilterConfig.addControl(param.id, this.fb.array(controlArray));
        }
    }

    fillSimpleTypeForm(param: JsonFormParameter) {
        if (this.objectId) {
            if (null == this.getObjectFormGroup(this.objectId)) {
                this.formUrlFilterConfig.addControl(param.id, this.buildControl(param, this.getValueForFiled(param.id)));
            } else {
                this.getObjectFormGroup(this.objectId).addControl(param.id, this.buildControl(param, ''));
            }
        } else {
            this.formUrlFilterConfig.addControl(param.id, this.buildControl(param, (this.values === undefined) ? '' : this.values));
        }
    }

    public getValueForFiled(paramId: string) {
        if (this.values === undefined) {
            return '';
        }
        if (this.values instanceof Array) {
            return this.values[paramId];
        }
        return this.values;
    }

    public isMaxNumberOfItems(parameter: JsonFormParameter) {
        return this.getFormArray(parameter.id).length >= parameter.type.maxArrayLength;
    }

    public isMinNumberOfItems(parameter: JsonFormParameter) {
        return this.getFormArray(parameter.id).length <= parameter.type.minArrayLength;
    }

    public getFormArrayControls(arrayId: string) {
        return this.getFormArray(arrayId).controls as FormControl[];
    }

    addToFormArray(parameter: JsonFormParameter) {
        if (this.getFormArray(parameter.id).length >= parameter.type.maxArrayLength) {
            return;
        }
        return (parameter?.type?.arrayType === 'object') ?
            this.getFormArray(parameter.id).push(this.fb.group({})) :
            this.getFormArray(parameter.id).push(this.buildControl(parameter, ''));
    }

    removeFromFormArray(parameter: JsonFormParameter, index: number) {
        if (this.getFormArray(parameter.id).length > parameter.type?.minArrayLength) {
            this.getFormArray(parameter.id).removeAt(index);
        }
    }

    getFormArray(arrayId: string) {
        return this.formUrlFilterConfig.get(arrayId) as FormArray;
    }

    private getObjectFormGroup(objectId: string) {
        return this.formUrlFilterConfig.get(objectId) as FormGroup;
    }

    private buildControl(param: JsonFormParameter, value: any): FormControl {
        if (param?.type?.type === 'boolean' || param?.type?.arrayType === 'boolean') {
            return this.fb.control(!!(value), FiltersFormElementComponent.getValidators(param));
        }
        return (param?.type?.arrayType === 'object') ? this.fb.control('') :
            this.fb.control(value, FiltersFormElementComponent.getValidators(param));
    }

}
