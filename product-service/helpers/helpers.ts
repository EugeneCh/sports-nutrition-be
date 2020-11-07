export function setCorsHeaders(headers: { [name: string]: boolean | number | string } = {}):  { [name: string]: boolean | number | string } {
    return {
        ...headers,
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Credentials' : true
    }
}
