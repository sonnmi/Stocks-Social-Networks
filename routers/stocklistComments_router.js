import { Router } from "express";
import { client } from "../datasource.js";
import { stockListCommentQuery } from "../queries/stocklistComments_query.js";
import { userQuery } from "../queries/users_query.js";

export const StockListCommentsRouter = Router();

StockListCommentsRouter.get("/:stocklist/:owner", async (req, res) => {
    try {
        const stocklist = req.params.stocklist;
        const owner = req.params.owner;
        console.log("get comments", stocklist, owner);
        let ownerId = -1;
        
            client.query(stockListCommentQuery.getStockListCommentsQuery(), [stocklist, owner], (err, data) => {
                if (err) {
                    console.log(err);
                } else if (!data || data.rows.length === 0) {
                    console.log("No stocklist comments found");
                    return res.json({ error: "No stocklist comments found" });
                } else {
                    return res.json(data.rows);
                }
                });
        
    } catch (err) {
        console.log(err);
    }
    });

StockListCommentsRouter.post("/add", async (req, res) => {
    try {
        const stocklist = req.body.stocklist;
        const owner = req.body.owner;
        const comment = req.body.comment;
        const reviewer = req.body.reviewer;
        let ownerId = -1;
        let reviewerId = -1;
        client.query(userQuery.getUserIdQuery(), [owner], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            ownerId = data.rows[0].userid;
            client.query(
                stockListCommentQuery.insertStockListCommentQuery(),
                [ownerId,reviewer, comment,stocklist],
                (err, data) => {
                    if (err) {
                    console.log(err);
                    } else {
                    return res.json({
                        message: "Comment added.",
                        stocklist: stocklist,
                        owner: owner,
                        comment: comment,
                    });
                    }
                },
                );
            }
        });
        
    } catch (err) {
        console.log(err);
    }
});

StockListCommentsRouter.delete("/delete", async (req, res) => {
    try {
        const stocklist = req.body.stocklist;
        const owner = req.body.owner;
        const comment = req.body.comment;
        const reviewer = req.body.reviewer;
        client.query(
        stockListCommentQuery.deleteStockListCommentQuery(),
        [stocklist, owner, comment, reviewer],
        (err, data) => {
            if (err) {
            console.log(err);
            } else {
            return res.json({
                message: "Comment deleted.",
                stocklist: stocklist,
                owner: owner,
                comment: comment,
            });
            }
        },
        );
    } catch (err) {
        console.log(err);
    }
});

StockListCommentsRouter.get("/own/:stocklist/:owner/:reviewer", async (req, res) => {
    try {
        console.log("get own comments");
        const stocklist = req.params.stocklist;
        const owner = req.params.owner;
        const reviewer = req.params.reviewer;
        let ownerId = -1;
        client.query(userQuery.getUserIdQuery(), [owner], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            ownerId = data.rows[0].userid;
            client.query(stockListCommentQuery.getStockListOwnCommentQuery(), [ownerId, reviewer, stocklist], (err, data) => {
                if (err) {
                    console.log(err);
                } else if (!data || data.rows.length === 0) {
                    console.log("No stocklist comments found");
                    return res.json({ error: "No stocklist comments found" });
                } else {
                    return res.json(data.rows);
                }
                });
        }
        });
        
    } catch (err) {
        console.log(err);
    }
    });