import { APIGatewayProxyHandler } from 'aws-lambda';
import { Product } from '../models/Product';
import { productsMock } from '../mocks/productList';
import { setCorsHeaders } from '../helpers/helpers';

export const getProductsList: APIGatewayProxyHandler = async () => {
    let products: Product[];
    try {
        products = await productsMock;
    } catch (error) {
        return {
            statusCode: 500,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                error
            ),
        };
    }
    return {
        statusCode: 200,
        headers: setCorsHeaders(),
        body: JSON.stringify(
            products
        ),
    };
}
