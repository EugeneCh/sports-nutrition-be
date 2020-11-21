import 'source-map-support/register';
import * as stream from 'stream';
import * as csvParser from 'csv-parser';
import { S3Event } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import { Request } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import { BUCKET_NAME, REGION } from '../contants/constants';
import { Product } from '../models/Product';

export const importFileParser: (event: S3Event) => void = (event: S3Event) => {
    console.log(`Import file started with record ${event.Records}`);

    const s3: S3 = new S3( { region: REGION } );
    const sqs: SQS = new SQS();

    for (const record of event.Records) {
        const stream: stream.Readable = s3.getObject({
            Bucket: BUCKET_NAME,
            Key: record.s3.object.key
        }).createReadStream();

        console.log('Read stream created');

        stream.pipe(csvParser())
            .on('data', async (product: Product) => {
                console.log('Send message with data to SQS', product);

                const request: Request<SQS.Types.SendMessageResult, AWSError> = await sqs.sendMessage({
                    QueueUrl: process.env.PRODUCTS_CATALOG_QUEUE_URL,
                    MessageBody: JSON.stringify(product)
                });
                request.send();
            })
            .on('end', async () => {
                console.log(`Copy object from ${BUCKET_NAME}/${record.s3.object.key} to ${BUCKET_NAME}/${record.s3.object.key.replace('uploaded', 'parsed')}`);

                await s3.copyObject({
                    Bucket: BUCKET_NAME,
                    CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
                    Key: record.s3.object.key.replace('uploaded', 'parsed')
                }).promise();

                console.log(`Delete object ${BUCKET_NAME}/${record.s3.object.key}`);

                await s3.deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: record.s3.object.key
                }).promise();
            })
            .on('error', (error: Error) => console.log(error));
    }
}
