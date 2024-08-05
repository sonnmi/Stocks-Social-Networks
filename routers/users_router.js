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

// usersRouter.get("/me", async (req, res) => {
//   // returns the user's info from the database
//   try {
//     const token = await Token.findOne({
//       where: {
//         token: req.headers.authorization.split("Bearer ")[1],
//       },
//     });
//     const user = await User.findOne({
//       where: {
//         id: token.UserId,
//       },
//     });
//     return res.json({ UserId: token.UserId, username: user.username });
//   } catch (e) {
//     return res.status(401).json({ error: "user not signed in" });
//   }
// });

// // get user(s) with offset/cursor-based pagination
// usersRouter.get("/", async (req, res) => {
//   const query = req.query;
//   if ("limit" in query) {
//     const limit = query.limit;
//     let state = {};
//     const count = await User.count();
//     if ("page" in query) {
//       const offset = (req.query.page - 1) * limit;
//       state = {
//         limit: limit,
//         offset: offset,
//         order: [["createdAt", "DESC"]],
//       };
//     } else {
//       // two actions in query is not allowed
//       if ("next" in query && "prev" in query) {
//         return res.status(422).json({
//           error: "Incorrect query. Expected either one prev or next pointer.",
//         });
//       } else if ("next" in query) {
//         state = {
//           raw: true,
//           limit: limit,
//           where: {
//             id: {
//               [Op.lt]: query.next,
//             },
//           },
//           order: [["id", "DESC"]],
//         };
//       } else if ("prev" in query) {
//         state = {
//           raw: true,
//           limit: limit,
//           where: {
//             id: {
//               [Op.gt]: query.prev,
//             },
//           },
//           order: [["id", "DESC"]],
//         };
//       } else {
//         state = {
//           raw: true,
//           limit: limit,
//           order: [["id", "DESC"]],
//         };
//       }
//     }
//     const users = await User.findAll(state);
//     if (users.length > 0) {
//       const current =
//         1 +
//         (await User.count({
//           where: {
//             id: {
//               [Op.gt]: users[0].id,
//             },
//           },
//           order: [["id", "DESC"]],
//         }));
//       return res.json({
//         users: users,
//         prev: users[users.length - 1].id,
//         next: users[users.length - 1].id + 1,
//         count: count,
//         current: current,
//         totalPage: Math.floor((count - 1) / limit) + 1,
//       });
//     } else {
//       return res.json({
//         users: null,
//         prev: null,
//         next: null,
//         count: 0,
//         current: null,
//         totalPage: Math.floor((count - 1) / limit) + 1,
//       });
//     }
//   } else {
//     return res.status(422).json({
//       error: "Missing required query. Expected both limit and page number.",
//     });
//   }
// });

// // get a user's image by userId
// usersRouter.get("/:userId/images", async (req, res) => {
//   const query = req.query;
//   if ("limit" in query) {
//     const limit = query.limit;
//     let state = {};
//     // two actions in query is not allowed
//     if ("next" in query && "prev" in query) {
//       return res.status(422).json({
//         error: "Incorrect query. Expected either one prev or next pointer.",
//       });
//     } else if ("next" in query) {
//       state = {
//         raw: true,
//         limit: limit,
//         where: {
//           id: {
//             [Op.lt]: query.next,
//           },
//           UserId: req.params.userId,
//         },
//         order: [["id", "DESC"]],
//         include: { association: "User", attributes: ["username", "id"] },
//       };
//     } else if ("prev" in query) {
//       state = {
//         raw: true,
//         limit: limit,
//         where: {
//           id: {
//             [Op.gt]: query.prev,
//           },
//           UserId: req.params.userId,
//         },
//         order: [["id", "ASC"]],
//         include: { association: "User", attributes: ["username", "id"] },
//       };
//     } else {
//       state = {
//         raw: true,
//         limit: limit,
//         where: {
//           UserId: req.params.userId,
//         },
//         order: [["id", "DESC"]],
//         include: { association: "User", attributes: ["username", "id"] },
//       };
//     }
//     const image = await Image.findAll(state);
//     const count = await Image.count({
//       where: {
//         UserId: req.params.userId,
//       },
//     });
//     if (image.length > 0) {
//       const current =
//         1 +
//         (await Image.count({
//           where: {
//             id: {
//               [Op.gt]: image[0].id,
//             },
//             UserId: req.params.userId,
//           },
//           order: [["id", "DESC"]],
//         }));
//       return res.json({
//         image: image[0],
//         prev: image[0].id,
//         next: image[0].id + 1,
//         count: count,
//         current: current,
//       });
//     } else {
//       return res.json({
//         image: null,
//         prev: null,
//         next: null,
//         count: 0,
//         current: null,
//       });
//     }
//   } else {
//     return res.status(422).json({
//       error: "Missing required query. Expected limit.",
//     });
//   }
// });
