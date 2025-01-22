const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const {
  registration_val,
  create_val,
  remove_val,
  login_val,
} = require("../validation/user_validation");
const { create_token, get_token_data, check_token } = require("./auth");
const User_schema = require("../schema/user_schema");

router.post("/registration", async (req, res) => {
  const data = req.body;
  // console.log(data)
  const { error } = registration_val({ data });
  if (error) {
    res.send({ error });
  } else {
    // data["role"] = "admin";
    const { password } = data;
    const hash_password = bcrypt.hashSync(password, saltRounds);
    data["password"] = hash_password;
    delete data["confirm_password"];
    const newUser = new User_schema(data);
    try {
      const response = await newUser.save();
      res.send({ user_data: response, success: true });
    } catch (error) {
      res.status(401).send(error);
    }
  }
});
router.post("/login", async (req, res) => {
  
  const { body } = req;
  const { error } = login_val({ data: body });
  if (error) {
    res.send({ error });
  } else {
    try {
      const { email, password } = body;
      const user_data = await User_schema.findOne({ email });
      if (user_data) {
        const { _id, role } = user_data;
        const isMatch = bcrypt.compareSync(password, user_data["password"]);
        if (isMatch) {
          const data = { email, _id,  role };
          let token = create_token({ data });
          delete user_data["password"];
          res.send({ data: user_data, token });
        } else {
          res.status(401).send("invalid email or password");
        }
      } else {
        res.status(401).send("invalid email or password");
      }
    } catch (error) {
      res.send(error.message);
    }
  }
});
router.post("/create", check_token, async (req, res) => {
  const { headers, body: data } = req;
  const { _id: create_by } = get_token_data({ headers });

  const { error } = create_val({ data });
  if (error) {
    res.status(401).send({ error });
  } else {
    data["create_by"] = create_by;
    const { password } = data;
    const hash_password = bcrypt.hashSync(password, saltRounds);
    data["password"] = hash_password;
    delete data["confirm_password"];
    const newUser = new User_schema(data);
    try {
      // const response = await insertOne({ table, value: data });
      const response = await newUser.save();
      res.send({ user_data: response, success: true });
    } catch (error) {
      res.status(401).send(error);
    }
  }
});
router.post("/remove", check_token, async (req, res) => {
  const { headers, body: data } = req;
  const { _id: create_by } = get_token_data({ headers });

  const { error } = remove_val({ data });
  if (error) {
    res.send({ error });
  } else {
    const { user_id } = data;

    try {
      const result = await User_schema.deleteOne({ _id: user_id, create_by });
      if (result.deletedCount === 1) {
        res.send({ success: true });
      } else {
        res.send({ error: "No document found with this ID" });
      }
    } catch (error) {
      res.send(error.message);
    }
  }
});
router.post("/list", async (req, res) => {
  const { headers } = req;
  const { _id: create_by, role } = get_token_data({ headers });
  if (role != "admin") {
    res.status(401).send({ error: "You can't see list" });
    return;
  }
  try {
    const response = await User_schema.find({ create_by });
    res.send(response);
  } catch (error) {
    res.status(401).send(error);
  }
});
module.exports = router;
