import { Router } from "express";
import { client } from "../datasource.js";
import { userQuery } from "../queries/users_query.js";
import { friendQuery } from "../queries/friend_query.js";

export const FriendRouter = Router();

FriendRouter.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;
    // Get user id of the user
    client.query(userQuery.getUserIdQuery(), [username], (err, data) => {
        if (err) {
            console.log(err);
        } else if (!data || data.rows.length === 0) {
            console.log("User not found");
        } else {
            const userId = data.rows[0].userid;
            // Get the friends of the user
            client.query(friendQuery.getUserFriendsQuery(), [userId], (err, data) => {
                if (err) {
                    console.log(err);
                } else if (!data || data.rows.length === 0) {
                    console.log("No friends found");
                    return res.json({ error: "No friends found" });
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

FriendRouter.post("/add", async (req, res) => {
  try {
    const username = req.body.username;
    const friendUsername = req.body.friendUsername;
    // Get the user id of the friend
    client.query(
        userQuery.getUserIdQuery(),
        [friendUsername],
        (err, data) => {
          if (err) {
            console.log(err);
          } else if (!data || data.rows.length === 0) {
            console.log("Friend not found");
          } else {
            const friendId = data.rows[0].userid;
            // Get the user id of the user
            client.query(
              userQuery.getUserIdQuery(),
              [username],
              (err, data) => {
                if (err) {
                  console.log(err);
                } else if (!data || data.rows.length === 0) {
                  console.log("User not found");
                } else {
                  const userId = data.rows[0].userid;
                  // Insert the user and friend into the friends table
                    client.query(
                    friendQuery.insertUserFriendQuery(),
                    [userId, friendId],
                    (err, data) => {
                        if (err) {
                        console.log(err);
                        } else {
                        return res.json({
                            message: "Friend added.",
                            username: username,
                            friendUsername: friendUsername,
                        });
                        }
                    },
                    );
                }
                },
            );

        }
      },
    );
  } catch (err) {
    console.log(err);
  }
});

FriendRouter.delete("/delete", async (req, res) => {
  try {
    // Get the user id of the friend
    client.query(
        userQuery.getUserIdQuery(),
        [req.body.friendUsername],
        (err, data) => {
            if (err) {
            console.log(err);
            } else if (!data || data.rows.length === 0) {
            console.log("Friend not found");
            } else {
            const friendId = data.rows[0].userid;
            // Get the user id of the user
            client.query(
                userQuery.getUserIdQuery(),
                [req.body.username],
                (err, data) => {
                if (err) {
                    console.log(err);
                } else if (!data || data.rows.length === 0) {
                    console.log("User not found");
                } else {
                    const userId = data.rows[0].userid;
                    // Delete the user and friend from the friends table
                    client.query(
                    friendQuery.deleteUserFriendQuery(),
                    [userId, friendId],
                    (err, data) => {
                        if (err) {
                        console.log(err);
                        } else {
                        return res.json({
                            message: "Friend deleted.",
                            username: req.body.username,
                            friendUsername: req.body.friendUsername,
                        });
                        }
                    },
                    );
                }
                },
            );
            }
        },
        );
    } catch (err) {
    console.log(err);
  }
});
