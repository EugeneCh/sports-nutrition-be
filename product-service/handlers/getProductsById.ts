import 'source-map-support/register';
import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler } from 'aws-lambda';
import { Client, QueryResult } from 'pg';
import { Product } from '../models/Product';
import { setCorsHeaders } from '../helpers/helpers';
import { createDbClient } from '../helpers/db.helper';

export const getProductsById: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>) => {
    const { id }: { [name: string]: string; } = event.pathParameters;
    const client: Client = createDbClient();
    client.connect();
    try {
        const allProductsQuery: string = 'select p.id, p.description, p.price, p.title, s.count from products p left join stocks s on p.id=s.product_id';
        const { rows: products }: QueryResult<Product> = await client.query(allProductsQuery);
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
    } catch (error) {
        return {
            statusCode: 500,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                error
            )
        };
    } finally {
        client.end();
    }

}
