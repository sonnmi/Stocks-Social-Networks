import { Router } from "express";
import { client } from "../datasource.js";
import { requestQuery } from "../queries/request_query.js";
import { userQuery } from "../queries/users_query.js";

export const RequestRouter = Router();

RequestRouter.get("/pending/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    client.query(requestQuery.getRequestsQuery(), [userId, 'pending'], (err, data) => {
      if (err) {
        console.log(err);
      } else if (!data || data.rows.length === 0) {
        console.log("No requests found");
        return res.json({ error: "No requests found" });
      } else {
        return res.json(data.rows);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

RequestRouter.post("/send", async (req, res) => {
  try {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const requestType = req.body.requestType;
    const requestStatus = req.body.requestStatus;
    const requestTime = req.body.requestTime;
    // Turns sender to userId
    client.query(userQuery.getUserIdQuery(), [sender], (err, data) => {
      if (err) {
        console.log(err);
      } else if (!data || data.rows.length === 0) {
        console.log("Sender not found");
      } else {
        const sender = data.rows[0].userid;
        // Turns receiver to userId
        client.query(userQuery.getUserIdQuery(), [receiver], (err, data) => {
          if (err) {
            console.log(err);
          } else if (!data || data.rows.length === 0) {
            console.log("Receiver not found");
          } else {
            const receiver = data.rows[0].userid;
            client.query(requestQuery.checkIfRejectedFiveMinutesAgo(), [sender, receiver], (err, data) => {
                if (err) {
                    console.log(err);
                } else if (!data || data.rows.length === 0) {
                    console.log("request not rejected 5 mins ago, continue");
                    client.query(
                        requestQuery.insertRequestQuery(),
                        [sender, receiver, requestType, requestStatus, requestTime],
                        (err, data) => {
                          if (err) {
                            console.log(err);
                          } else {
                            return res.json({
                              message: "Request sent.",
                              sender: sender,
                              receiver: receiver,
                            });
                          }
                        },
                      );
                } else {
                    return res.json({
                    message: "Request rejected 5 mins ago, please try again later.",
                    sender: sender,
                    receiver: receiver,
                    });
                }
                });

          }
      });
        }
    }
    );
  } catch (err) {
    console.log(err);
  }
});

RequestRouter.delete("/delete", async (req, res) => {
  try {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    client.query(
      requestQuery.deleteRequestQuery(),
      [sender, receiver],
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          return res.json({
            message: "Request deleted.",
            sender: sender,
            receiver: receiver,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

RequestRouter.put("/update", async (req, res) => {
  try {
    const requestStatus = req.body.requestStatus;
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    // Get the user id of the sender
    client.query(
      userQuery.getUserIdQuery(),
      [sender],
      (err, data) => {
        if (err) {
          console.log(err);
        } else if (!data || data.rows.length === 0) {
          console.log("Sender not found");
        } else {
          const sender = data.rows[0].userid;
          // Get the user id of the receiver
          client.query(
            userQuery.getUserIdQuery(),
            [receiver],
            (err, data) => {
              if (err) {
                console.log(err);
              } else if (!data || data.rows.length === 0) {
                console.log("Receiver not found");
              } else {
                const receiver = data.rows[0].userid;
                // Update the request status
                client.query(
                  requestQuery.updateRequestQuery(),
                  [requestStatus, sender, receiver],
                  (err, data) => {
                    if (err) {
                      console.log(err);
                    } else {
                      return res.json({
                        message: "Request updated.",
                        sender: sender,
                        receiver: receiver,
                      });
                    }
                  },
                );
              }
            },
          );
        }
      });
  } catch (err) {
    console.log(err);
  }
});