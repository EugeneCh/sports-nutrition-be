import 'source-map-support/register';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { Product } from '../models/Product';

export const catalogBatchProcess: (event: SQSEvent) => void = async (event: SQSEvent) => {
    const products: Product[] = event.Records.map(({ body }: SQSRecord) => JSON.parse(body));

    console.log('All products', products);
}
