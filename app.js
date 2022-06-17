require('dotenv').config(); // Parse the environment file

const express = require('express');
const axios = require('axios');

const app = express();

// Our API endpoint
app.get('/', async (req, res) => {
    let params = {
        'method': 'GET',
        'url': 'https://sandbox.merchant.wish.com/api/v3/orders/',
        'headers': {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        }
    };

    await axios(params)
    .then(
        (results) => {
            const orders = results.map((result) => {
                return {
                    purchaseOrderId: result.id,
                    orderDate: result.released_at,
                    lines: [{
                        lineItemId: result.product_information.id,
                        item: {
                            sku: result.product_information.sku,
                            productName: result.product_information.name,
                            retailSalesPrice: result.order_payment.general_payment_details.product_price.amount,
                        },
                        quantity: result.order_payment.general_payment_details.product_quantity,
                    }]
                };
            });
            res.send(orders);
        }
    ).catch(
        err => res.send(err.response.data)
    );
});

// Running the server
app.listen(3000, () => console.log('Server ready'));
