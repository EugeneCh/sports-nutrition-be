const express = require('express');
require('dotenv').config();
const axios = require('axios').default;
const nodeCache = require( "node-cache" );

const bffCache = new nodeCache({checkperiod: 30});
const app = express();

const PORT = process.env.PORT || 3001;
const ALL_PRODUCTS_URL = process.env['products-list'];
const EXPIRATION_TIME = 120;
const PRODUCTS_CACHE_KEY = 'products';

app.use(express.json());

app.all('/*', (req, res) => {
    console.log(req.originalUrl, 'original URL');
    console.log(req.method, 'method');
    console.log(req.body, 'body');

    const recipient = req.originalUrl.split('/')[1];
    console.log(recipient, 'recipient');

    const recipientURL = process.env[recipient];
    console.log(recipientURL, 'recipient URL');

    if (recipientURL) {
        if (recipientURL === ALL_PRODUCTS_URL) {
            const cachedProducts = bffCache.get(PRODUCTS_CACHE_KEY);
            if (cachedProducts) {
                res.json(cachedProducts);
                return;
            }
        }

        const axiosConfig = {
            method: req.method,
            url: `${recipientURL}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        };

        console.log(axiosConfig, 'axios config');

        axios(axiosConfig)
            .then((response) => {
                console.log(response.data, 'response from recipient');
                if (recipientURL === ALL_PRODUCTS_URL) {
                    bffCache.set(PRODUCTS_CACHE_KEY, response.data, EXPIRATION_TIME)
                }
                res.json(response.data);
            })
            .catch((error) => {
                console.log('recipient error: ', JSON.stringify(error));

                if (error.response) {
                    const { status, data } = error.response;
                    res.status(status).json(data);
                } else {
                    res.status(500).json({error: error.message});
                }
            });
    } else {
        res.status(502).json({error: 'Cannot process request'});
    }
});

app.listen(PORT, () => {
    console.log(`BFF service listening on ${PORT} port`);
});
