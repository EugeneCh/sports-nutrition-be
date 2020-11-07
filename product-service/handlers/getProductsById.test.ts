import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyResult } from 'aws-lambda';
import { productsMock } from '../mocks/productList';
import { Product } from '../models/Product';
import { getProductsById } from './getProductsById';

describe('getProductsById', () => {
    it('should return 404 status code when called with wrong id', async () => {
        const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> = {
            pathParameters: {
                id: '22'
            }
        } as unknown as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
        const response: void | APIGatewayProxyResult = await getProductsById(event, null, null);
        expect(response['statusCode']).toEqual(404);
    });

    it('should return 200 status code when called with correct id', async () => {
        const products: Product[] = await productsMock;
        const correctId: string = products[0].id;
        const event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext> = {
            pathParameters: {
                id: correctId
            }
        } as unknown as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
        const response: void | APIGatewayProxyResult = await getProductsById(event, null, null);
        expect(response['statusCode']).toEqual(200);
    })
});
