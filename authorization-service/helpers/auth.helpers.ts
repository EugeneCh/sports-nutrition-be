import { APIGatewayAuthorizerResult } from 'aws-lambda';
import { AuthorizerEffect } from '../constants/constants';

export function generatePolicy(principalId: string, resource: string, effect: AuthorizerEffect = AuthorizerEffect.DENY): APIGatewayAuthorizerResult {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
}
