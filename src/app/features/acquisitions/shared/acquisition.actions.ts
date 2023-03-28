import { Acquisition } from './models/acquisition.model';

export class AcquisitionActions {

    canStop(a: Acquisition): boolean {
        return (a.status === 'PROVISIONING' || a.status === 'QUEUED' || a.status === 'RUNNING' || a.status === 'PAUSED');
    }

    canPause(a: Acquisition): boolean {
        return (a.status === 'RUNNING');
    }

    canStart(a: Acquisition): boolean {
        return (a.status === 'PAUSED');
    }

    hasNoAction(a: Acquisition): boolean {
        return !(this.canStop(a) || this.canPause(a) || this.canStart(a));
    }

}
