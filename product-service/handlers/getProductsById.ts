import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Product } from '../models/Product';
import { productsMock } from '../mocks/productList';
import { setCorsHeaders } from '../helpers/helpers';

export const getProductsById: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>) => {
    const { id }: { [name: string]: string; } = event.pathParameters;
    let products: Product[];
    try {
        products = await productsMock;
    } catch (error) {
        return {
            statusCode: 500,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                error
            )
        };
    }
    const singleProduct: Product = products.find((product: Product) => product.id === id);
    return singleProduct ? {
        statusCode: 200,
        headers: setCorsHeaders(),
        body: JSON.stringify(
            singleProduct
        )
    } : {
        statusCode: 404,
        headers: setCorsHeaders(),
        body: JSON.stringify(
            `Product with ID ${id} not found`
        )
    };
}
