import 'source-map-support/register';
import { APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { setCorsHeaders } from '../helpers/helpers';
import { BUCKET_NAME } from '../contants/constants';

export const importProductsFile: APIGatewayProxyHandler = async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>) => {
    const filePath: string = `uploaded/${event.queryStringParameters.name}`;
    const s3: S3 = new S3( { region: 'eu-west-1' } );
    const params: { [name: string]: string | number; } = {
        Bucket: BUCKET_NAME,
        Key: filePath,
        Expires: 60,
        ContentType: 'text/csv'
    };
    try {
        const signedUrl: string = await s3.getSignedUrl('putObject', params);
        return {
            statusCode: 200,
            headers: setCorsHeaders(),
            body: signedUrl
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: setCorsHeaders(),
            body: JSON.stringify(
                error
            )
        };
    }
}
