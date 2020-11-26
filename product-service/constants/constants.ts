export const addProductQuery: string = 'insert into products (title, description, price) values ($1, $2, $3) returning id';
export const addStockQuery: string = 'insert into stocks (product_id, count) values ($1, $2)'
