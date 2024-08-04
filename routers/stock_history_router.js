import { Router } from "express";
import { client } from '../datasource.js';
import { stockHistoryQuery } from '../queries/stockHistory_query.js';
import { stockQuery } from '../queries/stock_query.js';

export const HistoryRouter = Router();

HistoryRouter.get("/:symbol", async (req, res) => {
    const symbol = req.params.symbol;
    const time = req.query.time; // Get the time parameter from the query string

    console.log("Time parameter:", time);
    // Determine the appropriate query based on the time parameter
    let query;
    switch (time) {
        case '1week':
            query = stockHistoryQuery.getStockHistory1week();
            break;
        case '1month':
            query = stockHistoryQuery.getStockHistory1month();
            break;
        case '3months':
            query = stockHistoryQuery.getStockHistory3months();
            break;
        case '6months':
            query = stockHistoryQuery.getStockHistory6months();
            break;
        case '1year':
            query = stockHistoryQuery.getStockHistory1year();
            break;
        case 'latest':
            query = stockHistoryQuery.getLatestStockHistoryBySymbol();
            break;
        case '5years':
        default: // Default to 5 years if no time parameter is provided or if it doesn't match any case
            query = stockHistoryQuery.getStockHistory5years();
    }

    // Execute the query with the provided symbol
    client.query(query, [symbol], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Internal server error"
            });
        } else if (!data || data.rows.length === 0) {
            return res.status(404).json({
                error: "Stock not listed."
            });
        } else {
            return res.json({
                stockHistory: data.rows
            });
        }
    });
});


HistoryRouter.get("variance/:symbol", async (req, res) => {
    const symbol = req.params.symbol;
    const time = req.query.time; // Get the time parameter from the query string

    console.log("Time parameter:", time);
    // Determine the appropriate query based on the time parameter
    let query;
    switch (time) {
        case '1week':
            query = stockQuery.getVariance1week();
            break;
        case '1month':
            query = stockQuery.getVariance1month();
            break;
        case '3months':
            query = stockQuery.getVariance3month();
            break;
        case '6months':
            query = stockQuery.getVariance6month();
            break;
        case '1year':
            query = stockQuery.getVariance1year();
            break;
        case '5years':
        default: // Default to 5 years if no time parameter is provided or if it doesn't match any case
            query = stockQuery.getVariance5year();
    }

    // Execute the query with the provided symbol
    client.query(query, [symbol], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Internal server error"
            });
        } else if (!data || data.rows.length === 0) {
            return res.status(404).json({
                error: "Stock not listed."
            });
        } else {
            return res.json({
                stockHistory: data.rows
            });
        }
    });
});