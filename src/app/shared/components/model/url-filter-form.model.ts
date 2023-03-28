export interface JsonFormName {
    default: string;
    translationKey?: string;
}

export interface JsonFilterHelp {
    default: string;
}

export interface JsonFormType {
    type: string;
    arrayType?: string;
    required: boolean;
    pattern?: string;
    maxLength?: number;
    minLength?: number;
    minimum?: number;
    maximum?: number;
    minArrayLength?: number;
    maxArrayLength?: number;
    parameters?: JsonFormParameter[];
}

export interface JsonFormParameter {
    id: string;
    name: JsonFormName;
    type: JsonFormType;
    help?: JsonFilterHelp;
}

export interface FiltersFormUrlData {
    id: string;
    name: JsonFormName;
    help?: JsonFilterHelp;
    parameters: JsonFormParameter[];
}
