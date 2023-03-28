export interface SourceImportErrorModel {
    sources: [{
        name: string;
        url: string;
        errors: any [];
    }];
}
