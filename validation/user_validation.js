const Joi = require("joi");

const registration_val = ({ data }) => {
  const validation_rules = {
    name: Joi.string().required().min(2),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    confirm_password: Joi.string().required().valid(Joi.ref("password")),
  };
  const schema = Joi.object(validation_rules);
  return schema.validate(data);
};
const login_val = ({ data }) => {
  const validation_rules = {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  };
  const schema = Joi.object(validation_rules);
  return schema.validate(data);
};
const create_val = ({ data }) => {
  const validation_rules = {
    name: Joi.string().required().min(2),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    confirm_password: Joi.string().required().valid(Joi.ref("password")),
  };
  const schema = Joi.object(validation_rules);
  return schema.validate(data);
};
const remove_val = ({ data }) => {
  const validation_rules = {
    user_id: Joi.string().required(),
  };
  const schema = Joi.object(validation_rules);
  return schema.validate(data);
};

module.exports = { registration_val, create_val, remove_val, login_val };
