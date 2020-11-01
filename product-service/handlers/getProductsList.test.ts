import { APIGatewayProxyResult } from 'aws-lambda';
import { getProductsList } from './getProductsList';

describe('getProductsList', () => {
    it('should return correct status code when called', async () => {
        const response: void | APIGatewayProxyResult = await getProductsList(null, null, null);
        expect(response['statusCode']).toEqual(200);
    })
})
