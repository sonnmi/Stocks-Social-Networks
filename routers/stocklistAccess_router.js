import { Router } from "express";
import { client } from "../datasource.js";
import { stockListAccessQuery } from "../queries/stocklistAccess_query.js";
import { userQuery } from "../queries/users_query.js";

export const StockListAccessRouter = Router();

StockListAccessRouter.get("/:stocklist/:owner", async (req, res) => {
    try {
        const stocklist = req.params.stocklist;
        const owner = req.params.owner;
        client.query(stockListAccessQuery.getStockListAccessByUserQuery(), [stocklist, owner], (err, data) => {
        if (err) {
            console.log(err);
        } else if (!data || data.rows.length === 0) {
            console.log("No stocklist access found");
            return res.json({ error: "No stocklist access found" });
        } else {
            return res.json(data.rows);
        }
        });
    } catch (err) {
        console.log(err);
    }
    }
);

StockListAccessRouter.get("/friendView/:owner/:viewer", async (req, res) => {
    try {
        const owner = req.params.owner;
        const viewer = req.params.viewer;
        let ownerId = -1;
        let viewerId = -1;
        console.log("owner", owner);
        console.log("viewer", viewer);
        client.query(userQuery.getUserIdQuery(), [owner], (err, data) => {
            if (err) {
                console.log(err);
            } else {
                ownerId = data.rows[0].userid;
                client.query(userQuery.getUserIdQuery(), [viewer], (err, data) => {
                    
                    if (err) {
                        console.log(err);
                    } else {
                        viewerId = data.rows[0].userid;
                        console.log("ownerId", ownerId);
                        console.log("viewerId", viewerId);
                        client.query(stockListAccessQuery.getStockListAccessByOwnerViewerQuery(), [ownerId, viewerId], (err, data) => {
                            

                            if (err) {
                                console.log(err);
                            } else if (!data || data.rows.length === 0) {
                                console.log("No stocklist access found");
                                return res.json({ error: "No stocklist access found" });
                            } else {
                                return res.json(data.rows);
                            }
                            });
                    }
                });
            }
        });
        
    } catch (err) {
        console.log(err);
    }
    }
);

StockListAccessRouter.post("/add", async (req, res) => {
    try {
        const stocklist = req.body.stocklist;
        const owner = req.body.owner;
        const viewer = req.body.viewer;
        let ownerId = -1;
        let viewerId = -1;
        client.query(userQuery.getUserIdQuery(), [owner], (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("owner", owner);
                ownerId = data.rows[0].userid;
                console.log("ownerId", ownerId);
                client.query(userQuery.getUserIdQuery(), [viewer], (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("viewer", viewer);
                        viewerId = data.rows[0].userid;
                        console.log("viewerId", viewerId);
                        client.query(
                            stockListAccessQuery.insertStockListAccessQuery(),
                            [stocklist, ownerId, viewerId],
                            (err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    return res.json({
                                        message: "Stocklist access added.",
                                        stocklist: stocklist,
                                        owner: owner,
                                        viewer: viewer,
                                    });
                                }
                            },
                        );
                    }
                    
                });
            }
        });
        
        console.log("adding share access", stocklist, ownerId, viewerId);
        
    } catch (err) {
        console.log(err);
    }
});

StockListAccessRouter.delete("/delete", async (req, res) => {
    try {
        const stocklist = req.body.stocklist;
        const owner = req.body.owner;
        const viewer = req.body.viewer;
        let ownerId = -1;
        let viewerId = -1;
        client.query(userQuery.getUserIdQuery(), [owner], (err, data) => {
            if (err) {
                console.log(err);
            } else {
                ownerId = data.rows[0].userid;
            }
        });
        client.query(userQuery.getUserIdQuery(), [viewer], (err, data) => {
            if (err) {
                console.log(err);
            } else {
                viewerId = data.rows[0].userid;
            }
        });
        client.query(
            stockListAccessQuery.deleteStockListAccessQuery(),
            [stocklist, owner, viewer],
            (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.json({
                        message: "Stocklist access deleted.",
                        stocklist: stocklist,
                        owner: owner,
                        viewer: viewer,
                    });
                }
            },
        );
    } catch (err) {
        console.log(err);
    }
});