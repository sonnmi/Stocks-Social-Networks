// correlation_router.js
import { Router } from "express";
import { client } from "../datasource.js";
import { correlationQuery } from "../queries/correlation_query.js"; // Correct path to your module

export const CorrelationRouter = Router();

CorrelationRouter.post("/matrix", async (req, res) => {
    const { stocks } = req.body; // Array of stock symbols
    if (!stocks || stocks.length < 2) {
        return res.status(400).json({ error: "At least two stock symbols required" });
    }

    const query = `
        SELECT stock1, stock2, CORR
        FROM correlation
        WHERE (stock1 = ANY($1) AND stock2 = ANY($1))
        AND stock1 < stock2
    `;

    try {
        const result = await client.query(query, [stocks]);
        const correlations = result.rows;

        // Build a matrix
        const correlationMatrix = {};
        stocks.forEach(stock => correlationMatrix[stock] = {});

        correlations.forEach(({ stock1, stock2, corr }) => {
            correlationMatrix[stock1][stock2] = corr;
            correlationMatrix[stock2][stock1] = corr; // Mirror the correlation
        });

        res.json(correlationMatrix);
    } catch (error) {
        console.error("Error fetching correlation matrix:", error);
        return res.status(500).json({ error: "Database query error" });
    }
});

// Get all correlations
CorrelationRouter.get("/all", async (req, res) => {
    client.query(correlationQuery.getAllCorrelationsQuery(), (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database query error" });
        } else if (!data || data.rows.length === 0) {
            console.log("No correlations found");
            return res.json({ error: "No correlations found" });
        } else {
            return res.json(data.rows);
        }
    });
});

// Get specific correlation
CorrelationRouter.get("/:stock1/:stock2/:time", async (req, res) => {
    let { stock1, stock2, time } = req.params;
    if (stock1 > stock2) {
        [stock1, stock2] = [stock2, stock1];
    }
    client.query(correlationQuery.getCorrelationQuery(), [stock1, stock2, time], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database query error" });
        } else if (!data || data.rows.length === 0) {
            console.log("No correlation found");
            return res.json({ error: "No correlation found" });
        } else {
            return res.json(data.rows);
        }
    });
});

// Add or update correlation
CorrelationRouter.post("/add/:stock1/:stock2/:time", async (req, res) => {
    let { stock1, stock2, time } = req.params;
    if (stock1 > stock2) {
        [stock1, stock2] = [stock2, stock1];
    }

    try {
        const correlationResponse = await fetch(`http://localhost:3000/api/history/correlation/${stock1}/${stock2}/${time}`);
        const correlationData = await correlationResponse.json();

        const correlation = correlationData.correlation;

        client.query(correlationQuery.addCorrelationQuery(), [stock1, stock2, correlation, time], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database insertion error" });
            } else {
                return res.json({ message: "Correlation added or updated" });
            }
        });
    } catch (error) {
        console.error("Error fetching correlation:", error);
        return res.status(500).json({ error: "Error fetching correlation data" });
    }
});

// Delete correlation
CorrelationRouter.delete("/delete/:stock1/:stock2", async (req, res) => {
    let { stock1, stock2 } = req.params;
    if (stock1 > stock2) {
        [stock1, stock2] = [stock2, stock1];
    }
    client.query(correlationQuery.deleteCorrelationQuery(), [stock1, stock2], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database deletion error" });
        } else {
            return res.json({ message: "Correlation deleted" });
        }
    });
});
