export interface Acquisition {
    id: number;
    workflowId: string;
    crawlerName: string;
    startDate: string;
    lastUpdateDate: string;
    status: string;
}

export interface CreateAcquisition {
    name: string;
    uuid: string;
}
