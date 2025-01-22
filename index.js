const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();

// ==================================
// Allow requests from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // if you need to send cookies or authentication headers
  })
);

// =============router=====================
const user = require("./routes/user");
const product = require("./routes/product");
const cart = require("./routes/cart");
const beforeLogProduct = require("./routes/beforeLogProduct")
// =============authorization checking=====================
const { check_token } = require("./routes/auth");
// =============database connection=====================
const { connect_to_mongo } = require("./db/mongoosedb");
connect_to_mongo();
// ===============middle were===================
app.use(express.json());
// app.use(check_token);
// =============router=====================
app.use("/user", user);
app.use("/product", product);
app.use("/cart", cart);
app.use("/beforeLogProduct" , beforeLogProduct)
// ==================================
app.listen(process.env.PORT, () => {
  console.log("working on", process.env.PORT);
});
