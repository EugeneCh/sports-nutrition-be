import 'source-map-support/register';
import { APIGatewayAuthorizerResult, Context } from 'aws-lambda';
import {
    APIGatewayAuthorizerCallback,
    APIGatewayTokenAuthorizerEvent
} from 'aws-lambda/trigger/api-gateway-authorizer';
import { AUTHORIZER_EVENT_TYPE, AuthorizerEffect } from '../constants/constants';
import { generatePolicy } from '../helpers/auth.helpers';

export const basicAuthorizer: (event: APIGatewayTokenAuthorizerEvent, _: Context, callback: APIGatewayAuthorizerCallback) => Promise<void> =
    async (event: APIGatewayTokenAuthorizerEvent, _: Context, callback: APIGatewayAuthorizerCallback) => {
    console.log('Event: ', JSON.stringify(event));

    if (event.type !== AUTHORIZER_EVENT_TYPE) {
        callback('Unauthorized');
    }

    try {
        const authorizationToken: string = event.authorizationToken;
        const encodedCreds: string = authorizationToken.split(' ')[1];
        const buff: Buffer = Buffer.from(encodedCreds, 'base64');
        const plainCreds: string[] = buff.toString('utf-8').split(':');
        const [username, password]: string[] = plainCreds;
        console.log(`Username: ${username}, password: ${password}`);

        const storedUserPassword: string = process.env[username];
        const effect: AuthorizerEffect = !Boolean(storedUserPassword) || storedUserPassword !== password ? AuthorizerEffect.DENY : AuthorizerEffect.ALLOW;
        const policy: APIGatewayAuthorizerResult = generatePolicy(encodedCreds, event.methodArn, effect);

        callback(null, policy);
    } catch (error) {
        callback(`Unauthorized: ${error.message}`)
    }
}

