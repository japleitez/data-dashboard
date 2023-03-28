export interface SourceError {
    name: string;
    url: string;
    errors: string[];
}

export interface FieldError {
    objectName: string;
    field: string;
    message: string;
}

export interface CrawlerImportResponseModel {
    crawler: string | null;
    sourceErrors?: (SourceError)[] | null;
    fieldErrors?: (FieldError)[] | null;
}
