import { SQSEvent } from 'aws-lambda';
import { SQSRecord } from 'aws-lambda/trigger/sqs';
import { SNS } from 'aws-sdk';
import { mock, restore } from 'aws-sdk-mock';
import { products } from '../mocks/productList';
import { Product } from '../models/Product';
import { catalogBatchProcess } from './catalogBatchProcess';

jest.mock('../helpers/db.helper', () => {
    return {
        createDbClient: () => {
            return {
                connect: jest.fn(),
                query: jest.fn().mockReturnValue(new Promise((res) => res({ rows: [products[0]] }))),
                end: jest.fn()
            };
        }
    }
});

describe('catalogBatchProcess', () => {
    const snsMock: SNS = {
        publish: jest.fn().mockReturnValue(new Promise((res) => res({ send: () => {} })))
    } as unknown as SNS;

    beforeEach(() => {
        mock('SNS', 'publish', snsMock.publish);
    });

    afterEach(() => {
        restore();
    });

    it('should send message success email for valid product creation', async () => {
        const event: SQSEvent = {
            Records: [products[0]].map((product: Product) => {
                return {
                    body: JSON.stringify(product)
                } as SQSRecord;
            })
        };
        await catalogBatchProcess(event);
        expect(snsMock.publish).toHaveBeenCalled();
    })
});
