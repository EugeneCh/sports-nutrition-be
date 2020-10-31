import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Product } from '../models/Product';
import { productsMock } from '../mocks/productList';

export const getProductsById: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>) => {
    const { id }: { [name: string]: string; } = event.pathParameters;
    let products: Product[];
    try {
        products = await productsMock;
    } catch (error) {
        console.log(error);
    }
    const singleProduct: Product = products.find((product: Product) => product.id === id);
    return {
        statusCode: 200,
        body: JSON.stringify(
            singleProduct
        ),
    };
}
