const Joi = require("joi");
const del_val = ({ data }) => {
    const validation_rules = {
      task_id: Joi.string().required(),
    };
    const schema = Joi.object(validation_rules);
    return schema.validate(data);
  };


  module.exports ={del_val};