import { Product } from '../models/Product';

export function isProductBodyValid(body: Product): boolean {
    return body.hasOwnProperty('title') && body.hasOwnProperty('count') && body.hasOwnProperty('description') && body.hasOwnProperty('price');
}
