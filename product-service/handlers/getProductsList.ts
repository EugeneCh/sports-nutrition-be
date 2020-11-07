import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client, QueryResult } from 'pg';
import { Product } from '../models/Product';
import { setCorsHeaders } from '../helpers/helpers';
import { createDbClient } from '../helpers/db.helper';

export const getProductsList: APIGatewayProxyHandler = async () => {
    const client: Client = createDbClient();
    client.connect();
    try {
        const allProductsQuery: string = 'select p.id, p.description, p.price, p.title, s.count from products p left join stocks s on p.id=s.product_id';
        const { rows: products }: QueryResult<Product> = await client.query(allProductsQuery);
        return {
            statusCode: 200,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                products
            ),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                error
            ),
        };
    } finally {
        client.end();
    }
}
