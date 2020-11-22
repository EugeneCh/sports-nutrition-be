import 'source-map-support/register';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import {AWSError, Request, SNS, SQS} from 'aws-sdk';
import { Client, QueryResult } from 'pg';
import { Product } from '../models/Product';
import { createDbClient } from '../helpers/db.helper';
import { isProductBodyValid } from '../helpers/validator.helper';
import { addProductQuery, addStockQuery } from '../constants/constants';

export const catalogBatchProcess: (event: SQSEvent) => void = async (event: SQSEvent) => {
    const client: Client = createDbClient();
    await client.connect();

    const sns: SNS = new SNS({ region: process.env.REGION_NAME });

    const products: Product[] = event.Records.map(({ body }: SQSRecord) => JSON.parse(body));
    console.log('All products', products);

    for (const product of products) {
        if (!isProductBodyValid(product)) {
            console.log('Invalid product send error message');
            continue;
        }
        const { title, count, description, price } = product;
        try {
            await client.query('BEGIN');
            const createdProduct: QueryResult<Product> = await client.query(addProductQuery, [title, description, price]);
            const productId: string = createdProduct.rows[0].id;
            await client.query(addStockQuery, [productId, count]);
            await client.query('COMMIT')

            console.log('Send success message');
            const request: Request<SQS.Types.SendMessageResult, AWSError> = await sns.publish({
                Subject: `New catalog item ${title} created`,
                Message: JSON.stringify(product),
                TopicArn: process.env.SNS_TOPIC_ARN
            });
            request.send();
        } catch (error) {
            await client.query('ROLLBACK');
            console.log('Send error message', error);
        }
    }
    await client.end();
}
