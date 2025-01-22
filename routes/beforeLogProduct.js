const express = require("express");
const router = express();
const product_schema = require("../schema/product_schema");



router.post("/ProductList", async (req, res) => {

    try {
        const response = await product_schema.find()
          res.send(response)
    } catch (error) {
      res.status(401).send(error)
    }
});


module.exports = router;