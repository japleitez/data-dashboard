import { HttpRequest } from '@angular/common/http';
import { createRequestOption } from './request-util';

describe('Request Utils Test', () => {
    it ('test', () => {
        let url = 'https://google.com';
        const req = new HttpRequest('GET', url, {
            reportProgress: true
        });
        const options = createRequestOption(req);
        expect(options).not.toBeNull();
    });
});
