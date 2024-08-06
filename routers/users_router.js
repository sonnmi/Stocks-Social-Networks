import { Router } from "express";
import { client } from "../datasource.js";
import { userQuery } from "../queries/users_query.js";

export const usersRouter = Router();

usersRouter.post("/signup", async (req, res) => {
  if (
    !("username" in req.body && "password" in req.body && "email" in req.body)
  ) {
    return res.status(422).json({ error: "Missing required field." });
  }
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  try {
    client.query(
      userQuery.insertUserQuery(),
      [username, password, email],
      (err, response) => {
        if (err) {
          if (err.detail.includes(`(username)=(${username}) already exists`)) {
            return res.status(409).json({ error: "Username is already used." });
          } else if (err.detail.includes(`(email)=(${email} already exists)`)) {
            return res.status(409).json({ error: "email is already used." });
          } else {
            return res.status(400).json({ error: "User cannot be inserted." });
          }
        } else {
          return res.json({
            username,
            email,
          });
        }
      },
    );
  } catch (err) {
    return res.status(422).json({ error: "User creation failed." });
  }
});

usersRouter.post("/signin", async (req, res) => {
  if (!("username" in req.body && "password" in req.body)) {
    return res.status(422).json({ error: "Missing required fields." });
  }
  console.log(req.body.username, req.body.password);
  client.query(
    userQuery.loginQuery(),
    [req.body.username, req.body.password],
    (err, response) => {
      if (err || !response.rows.length) {
        if (err) console.log(err.message);
        return res
          .status(401)
          .json({ error: "Incorrect username or password." });
      } else {
        const user = response.rows[0];
        return res.json({ user });
      }
    },
  );
});

// usersRouter.post("/signout", isAuthenticated, async (req, res) => {
//   const token = await Token.findOne({
//     where: {
//       token: req.headers.authorization.split("Bearer ")[1],
//     },
//   });
//   if (!token) {
//     return res.status(404).json({ error: "User auth does not exist" });
//   }
//   await token.destroy();
//   return res.json({ message: "signed out" });
// });
