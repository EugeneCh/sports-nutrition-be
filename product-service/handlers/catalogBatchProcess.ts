import 'source-map-support/register';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { Client, QueryResult } from 'pg';
import { Product } from '../models/Product';
import { createDbClient } from '../helpers/db.helper';
import { isProductBodyValid } from '../helpers/validator.helper';
import { addProductQuery, addStockQuery } from '../constants/constants';

export const catalogBatchProcess: (event: SQSEvent) => void = async (event: SQSEvent) => {
    const client: Client = createDbClient();
    await client.connect();
    const products: Product[] = event.Records.map(({ body }: SQSRecord) => JSON.parse(body));

    console.log('All products', products);

    for (const product of products) {
        if (!isProductBodyValid(product)) {
            console.log('Invalid product send error message');
        }
        const { title, count, description, price } = product;
        try {
            await client.query('BEGIN');
            const product: QueryResult<Product> = await client.query(addProductQuery, [title, description, price]);
            const productId: string = product.rows[0].id;
            await client.query(addStockQuery, [productId, count]);
            await client.query('COMMIT')
            console.log('Send success message');
        } catch (error) {
            await client.query('ROLLBACK');
            console.log('Send error message', error);
        }
    }
    await client.end();
}
