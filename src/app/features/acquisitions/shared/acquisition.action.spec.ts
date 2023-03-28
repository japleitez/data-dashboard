import { Acquisition } from './models/acquisition.model';
import {AcquisitionActions} from './acquisition.actions';

describe('Acquisition Actions IT', () => {

    let acquisition: Acquisition;

    beforeEach(() => {
        acquisition = new class implements Acquisition {
            crawlerName: string;
            id: number;
            lastUpdateDate: string;
            startDate: string;
            status: string;
            workflowId: string;
        };
    });

    it('should enable Stop action if acquisition status is PROVISIONING', () => {
        let acquisitionAction = new AcquisitionActions();
        acquisition.status = 'PROVISIONING';
        expect(acquisitionAction.canStop(acquisition)).toBeTrue();
    });

    it('should enable Stop action if acquisition status is QUEUED', () => {
        let acquisitionAction = new AcquisitionActions();
        acquisition.status = 'QUEUED';
        expect(acquisitionAction.canStop(acquisition)).toBeTrue();
    });

    it('should enable Stop action if acquisition status is PAUSED', () => {
        let acquisitionAction = new AcquisitionActions();
        acquisition.status = 'PAUSED';
        expect(acquisitionAction.canStop(acquisition)).toBeTrue();
    });

    it('should enable Pause action if acquisition status is RUNNING', () => {
        let acquisitionAction = new AcquisitionActions();
        acquisition.status = 'RUNNING';
        expect(acquisitionAction.canPause(acquisition)).toBeTrue();
    });

    it('should enable Start action if acquisition status is PAUSED', () => {
        let acquisitionAction = new AcquisitionActions();
        acquisition.status = 'PAUSED';
        expect(acquisitionAction.canStart(acquisition)).toBeTrue();
    });

    it('should disable all actions if acquisition status is SUCCESS', () => {
        let acquisitionAction = new AcquisitionActions();
        acquisition.status = 'SUCCESS';
        expect(acquisitionAction.canStart(acquisition)).toBeFalse();
    });

    it('should disable all actions if acquisition status is ERROR', () => {
        let acquisitionAction = new AcquisitionActions();
        acquisition.status = 'ERROR';
        expect(acquisitionAction.canStart(acquisition)).toBeFalse();
    });

    it('should disable all actions if acquisition status is STOPPED', () => {
        let acquisitionAction = new AcquisitionActions();
        acquisition.status = 'STOPPED';
        expect(acquisitionAction.canStart(acquisition)).toBeFalse();
    });

});
