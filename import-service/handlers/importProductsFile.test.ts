import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyResult } from 'aws-lambda';
import { mock, restore } from 'aws-sdk-mock';
import { importProductsFile } from './importProductsFile';

describe('importProductsFile', () => {
    const signedUrl: string = 'signedUrl';

    beforeEach(() => {
        mock('S3', 'getSignedUrl', signedUrl);
    });

    afterEach(() => {
        restore();
    });

    it('should complete successfully.', async () => {
        const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> = {
            queryStringParameters: {
                name: 'test.csv'
            }
        } as unknown as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
        const response: void | APIGatewayProxyResult = await importProductsFile(event, null, null);
        console.log(response);
        expect(response['statusCode']).toEqual(200);
    })
});
