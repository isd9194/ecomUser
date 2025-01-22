const Joi = require("joi");

const task_add_val = ({ data }) => {
  const validation_rules = {
    title: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    due_date: Joi.string().required().min(2),
  };
  const schema = Joi.object(validation_rules);
  return schema.validate(data);
};
const task_edit_val = ({ data }) => {
  const validation_rules = {
    task_id: Joi.string().required().length(24),
    title: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    due_date: Joi.required().min(1),
  };
  const schema = Joi.object(validation_rules);
  return schema.validate(data);
};

module.exports = { task_add_val, task_edit_val };
