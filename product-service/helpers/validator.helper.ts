export function isProductBodyValid(body: { [name: string]: string; }): boolean {
    return body.hasOwnProperty('title') && body.hasOwnProperty('count') && body.hasOwnProperty('description') && body.hasOwnProperty('price');
}
