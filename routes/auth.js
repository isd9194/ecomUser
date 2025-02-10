const jsonwebtoken = require("jsonwebtoken");
const jwt_pass = process.env.JWT_SECRET;

const check_token = (req, res, next) => {

  const { headers } = req;
  const { authorization } = headers;
  const bearer_token = authorization?.split(" ")[1]
    
  if (!bearer_token) {return res.status(401).send("token missing") } else {
    jsonwebtoken.verify(bearer_token, jwt_pass, (err) => {
         if(err){
         return res.status(401).send(err.message)
         }else{
          next();
         }
      })
  }
}

const create_token = ({ data }) => {
  return jsonwebtoken.sign(data, jwt_pass, {});
};

const get_token_data = ({ headers }) => {

  const { authorization } = headers;
  
  const token = authorization.split(" ");



let data1;
let err1;
  jsonwebtoken.verify(token[1], jwt_pass, (err, data) => {
    data1 = data;
     err1 = err;
  });
  
  return data1;
};

module.exports = { check_token, create_token, get_token_data };
