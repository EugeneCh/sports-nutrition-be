import 'source-map-support/register';
import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler } from 'aws-lambda';
import { Client, QueryResult } from 'pg';
import { Product } from '../models/Product';
import { setCorsHeaders } from '../helpers/helpers';
import { createDbClient } from '../helpers/db.helper';

export const addNewProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>) => {
    console.log(event, 'addNewProduct event');
    const { title, count, description, price }: { [name: string]: string; } = JSON.parse(event.body);
    const client: Client = createDbClient();
    await client.connect();
    try {
        const addProductQuery: string = 'insert into products (title, description, price) values ($1, $2, $3) returning id';
        const addStockQuery: string = 'insert into stocks (product_id, count) values ($1, $2)'
        const product: QueryResult<Product> = await client.query(addProductQuery, [title, description, price]);
        const productId: string = product.rows[0].id;
        await client.query(addStockQuery, [productId, count]);
        return {
            statusCode: 201,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                `Product ${productId} created`
            )
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                error
            )
        };
    } finally {
        await client.end();
    }

}
