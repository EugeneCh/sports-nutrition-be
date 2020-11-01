import { APIGatewayProxyHandler } from 'aws-lambda';
import { Product } from '../models/Product';
import { productsMock } from '../mocks/productList';

export const getProductsList: APIGatewayProxyHandler = async () => {
    let products: Product[];
    try {
        products = await productsMock;
    } catch (error) {
        console.log(error);
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify(
            products
        ),
    };
}
