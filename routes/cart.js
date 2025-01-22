const express = require("express");


const { check_token, get_token_data } = require("./auth");
const Cart_schema = require("../schema/Cart_schema");

const router = express.Router();
router.use(check_token);

router.post("/add", async (req, res) => {
  const { headers, body: data } = req;
      
    const { _id: create_by } = get_token_data({ headers });
    try {
      data["create_by"] = create_by;
      
     
      const newTask = new Cart_schema(data);
      const response = await newTask.save();
      res.send(response);
    } catch (error) {
      res.status(401).send(error);
    }
  
});



router.post("/items" , async(req , res)=>{
  const {headers} = req;
  const { _id: create_by } = get_token_data({ headers });
try {
  const result = await Cart_schema.find({create_by});
  res.send(result);
} catch (error) {
  res.status(401).send("something went wrong")
}
});


router.post("/remove" , async(req , res)=>{
  const {headers , body} = req;
   const data = body ;
  const { _id: create_by } = get_token_data({ headers });

try {
  const result = await Cart_schema.deleteOne({create_by},data);
  res.send(result);
} catch (error) {
  res.status(401).send("something went wrong")
}
});

router.post("/update" , async(req , res)=>{
  const {headers , body} = req;
   const {item_id , quantity} = body ;
     
  const { _id: create_by } = get_token_data({ headers });

try {
  const result = await Cart_schema.updateOne({create_by ,item_id},{$set:{quantity}});
  res.send(result);
} catch (error) {
  res.status(401).send("something went wrong")
}
});

module.exports =router ; 