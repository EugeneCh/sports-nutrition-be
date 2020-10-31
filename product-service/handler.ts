import { promises as fsPromises } from 'fs';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Product } from './models/Product';

export const getProductsList: APIGatewayProxyHandler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
        [
          {
            "count": 4,
            "description": "Short Product Description1",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            "price": 2.4,
            "title": "ProductOne"
          },
          {
            "count": 6,
            "description": "Short Product Description3",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
            "price": 10,
            "title": "ProductNew"
          },
          {
            "count": 7,
            "description": "Short Product Description2",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
            "price": 23,
            "title": "ProductTop"
          },
          {
            "count": 12,
            "description": "Short Product Description7",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
            "price": 15,
            "title": "ProductTitle"
          },
          {
            "count": 7,
            "description": "Short Product Description2",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
            "price": 23,
            "title": "Product"
          },
          {
            "count": 8,
            "description": "Short Product Description4",
            "id": "7567ec4b-b10c-48c5-9345-fc73348a80a1",
            "price": 15,
            "title": "ProductTest"
          },
          {
            "count": 2,
            "description": "Short Product Description1",
            "id": "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
            "price": 23,
            "title": "Product2"
          },
          {
            "count": 3,
            "description": "Short Product Description7",
            "id": "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            "price": 15,
            "title": "ProductName"
          }
        ]
    ),
  };
}

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  const { id }: { [name: string]: string; }  = event.pathParameters;
  let data: Buffer;
  try {
    data = await fsPromises.readFile('./mocks/productList.json');
  } catch (error) {
    console.log(error);
  }
  const products: Product[] = JSON.parse(data.toString());
  const singleProduct: Product = products.find((product: Product) => product.id === id);
  return {
    statusCode: 200,
    body: JSON.stringify(
        singleProduct
    ),
  };
}
