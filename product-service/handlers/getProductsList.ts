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
        body: JSON.stringify(
            products
        ),
    };
}
