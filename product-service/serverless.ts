import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: [
      'serverless-webpack',
      'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_QUEUE_URL: {
        'Ref': 'SQSQueue'
      }
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      }
    },
    Outputs: {
      CatalogItemsQueue: {
        Value: {
          'Ref': 'SQSQueue'
        },
        Export: {
          Name: 'CatalogItemsQueue'
        },
        Description: 'URL for catalog items SQS'
      },
      CatalogItemsQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
        Export: {
          Name: 'CatalogItemsQueueArn'
        },
        Description: 'ARN for catalog items SQS'
      }
    }
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products-list',
            cors: true
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'product/{id}',
            cors: true
          }
        }
      ]
    },
    addNewProduct: {
      handler: 'handler.addNewProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': ['SQSQueue', 'Arn']
            }
          }
        }
      ]

    }
  }
}

module.exports = serverlessConfiguration;
