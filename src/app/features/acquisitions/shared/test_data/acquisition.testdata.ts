import { Acquisition } from '../models/acquisition.model';

export function createTestsAcquisitionList(size: number): Acquisition[] {
    const acquisitions = [];
    for (let i = 1; i < size + 1; i++) {
        acquisitions.push(createTestAcquisition(i));
    }
    return acquisitions;
}

export function createTestAcquisition(id: number): Acquisition {
    const acquisition: Acquisition = {
        'id': id,
        'workflowId': '',
        'crawlerName': 'crawler' + id,
        startDate: '',
        lastUpdateDate: '',
        status: 'SUCCESS'
    };
    return acquisition;
}
