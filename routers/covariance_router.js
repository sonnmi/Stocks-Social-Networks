import { Router } from "express";
import { client } from "../datasource.js";
import { covarianceQuery } from "../queries/covariance_query.js"; // Correct path to your module

export const CovarianceRouter = Router();

CovarianceRouter.post("/matrix", async (req, res) => {
    const { stocks } = req.body; // Array of stock symbols
    if (!stocks || stocks.length < 2) {
        return res.status(400).json({ error: "At least two stock symbols required" });
    }

    const query = `
        SELECT stock1, stock2, covar
        FROM covariance
        WHERE (stock1 = ANY($1) AND stock2 = ANY($1))
        AND stock1 < stock2
    `;

    try {
        const result = await client.query(query, [stocks]);
        const covariances = result.rows;

        // Build a matrix
        const covarianceMatrix = {};
        stocks.forEach(stock => covarianceMatrix[stock] = {});

        covariances.forEach(({ stock1, stock2, corr }) => {
            covarianceMatrix[stock1][stock2] = corr;
            covarianceMatrix[stock2][stock1] = corr; // Mirror the covariance
        });

        res.json(covarianceMatrix);
    } catch (error) {
        console.error("Error fetching covariance matrix:", error);
        return res.status(500).json({ error: "Database query error" });
    }
});

// Get specific covariance
CovarianceRouter.get("/:stock1/:stock2/:time", async (req, res) => {
    let { stock1, stock2, time } = req.params;
    if (stock1 > stock2) {
        [stock1, stock2] = [stock2, stock1];
    }
    client.query(covarianceQuery.getCovarianceQuery(), [stock1, stock2, time], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database query error" });
        } else if (!data || data.rows.length === 0) {
            console.log("No covariance found");
            return res.json({ error: "No covariance found" });
        } else {
            return res.json(data.rows);
        }
    });
});

// Add or update covariance
CovarianceRouter.post("/add/:stock1/:stock2/:time", async (req, res) => {
    let { stock1, stock2, time } = req.params;
    if (stock1 > stock2) {
        [stock1, stock2] = [stock2, stock1];
    }

    try {
        // CACHING
        // CHECK IF COVARIANCE IS CACHED
        try {
            const isCached = await client.query(covarianceQuery.isCached(), [stock1, stock2, time]);
            if (isCached.rows.length > 0) {
                console.log("Covariance is cached");
                return res.json({ message: "Covariance is cached" });
            }
        } catch (error) {
            console.error("Error fetching cached covaraince:", error);
            return res.status(500).json({ error: "Error fetching cached covariance data" });
        }
        const covarianceResponse = await fetch(`http://localhost:3000/api/history/covariance/${stock1}/${stock2}/${time}`);
        const covarianceData = await covarianceResponse.json();

        const covariance = covarianceData.covariance;

        client.query(covarianceQuery.addCovarianceQuery(), [stock1, stock2, covariance, time], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database insertion error" });
            } else {
                return res.json({ message: "Covariance added or updated" });
            }
        });
    } catch (error) {
        console.error("Error fetching covariance:", error);
        return res.status(500).json({ error: "Error fetching covariance data" });
    }
});
