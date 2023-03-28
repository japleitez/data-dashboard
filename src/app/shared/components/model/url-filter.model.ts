export interface FilterName {
    default: string;
    translationKey: string;
}

export interface UrlFilter {
    id: string;
    name: FilterName;
}
