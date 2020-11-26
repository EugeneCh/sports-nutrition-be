import 'source-map-support/register';
import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler } from 'aws-lambda';
import { Client, QueryResult } from 'pg';
import { Product } from '../models/Product';
import { setCorsHeaders } from '../helpers/helpers';
import { createDbClient } from '../helpers/db.helper';
import { isProductBodyValid } from '../helpers/validator.helper';
import { addProductQuery, addStockQuery } from '../constants/constants';

export const addNewProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>) => {
    console.log(event, 'addNewProduct event');
    if (!Boolean(event.body) && !isProductBodyValid(JSON.parse(event.body))) {
        return {
            statusCode: 400,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                'Body is invalid'
            )
        }
    }
    const { title, count, description, price }: { [name: string]: string; } = JSON.parse(event.body);
    const client: Client = createDbClient();
    await client.connect();
    try {
        await client.query('BEGIN');
        const product: QueryResult<Product> = await client.query(addProductQuery, [title, description, price]);
        const productId: string = product.rows[0].id;
        await client.query(addStockQuery, [productId, count]);
        await client.query('COMMIT')
        return {
            statusCode: 201,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                `Product ${productId} created`
            )
        }
    } catch (error) {
        await client.query('ROLLBACK');
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
