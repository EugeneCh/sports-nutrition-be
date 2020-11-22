import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service-buck'
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
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: ['arn:aws:s3:::import-service-buck'],
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ['arn:aws:s3:::import-service-buck/*'],
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: ['${cf:product-service-${self:provider.stage}.CatalogItemsQueueArn}']
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PRODUCTS_CATALOG_QUEUE_URL: {
        'Fn::ImportValue': 'CatalogItemsQueue'
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            cors: true
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: 'import-service-buck',
            event: 's3:ObjectCreated:*',
            rules: [{
              prefix: 'uploaded/',
              suffix: ''
            }],
            existing: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
