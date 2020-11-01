import { setCorsHeaders } from './helpers';

describe('setCorsHeaders', () => {
    it('should set CORS headers', () => {
        expect(setCorsHeaders()['Access-Control-Allow-Credentials']).toBeTruthy();
    });
});
