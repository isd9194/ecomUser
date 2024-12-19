const express = require("express");
const Task_schema = require("../schema/task_schema");
const {
  task_add_val,
  task_edit_val,
} = require("../validation/task_validation");
const { check_token, get_token_data } = require("./auth");
const { del_val } = require("../validation/task_del_val");
const router = express.Router();
router.use(check_token);

router.post("/add", async (req, res) => {
  const { headers, body: data } = req;
  
  const { error } = task_add_val({ data });
  if (error) {
    res.status(401).send({ error });
  } else {
    const { _id: create_by } = get_token_data({ headers });
    try {
      data["create_by"] = create_by;
      
     
      const newTask = new Task_schema(data);
      const response = await newTask.save();
      res.send(response);
    } catch (error) {
      res.status(401).send(error);
    }
  }
});
router.post("/list", async (req, res) => {
  const { headers } = req;
  const { _id: create_by } = get_token_data({ headers });
  try {
    const response = await Task_schema.find({ create_by });
    res.send(response);
  } catch (error) {
    res.status(401).send(error.message);
  }
});
// router.post("/single", async (req, res) => {
//   const { headers, body: data } = req;
//   const { _id: create_by } = get_token_data({ headers });
//   const { task_id } = data;
//   if (task_id?.length === 24) {
//     try {
//       const condition = { create_by, _id: task_id };
//       const response = await Task_schema.find(condition);
//       res.send(response);
//     } catch (error) {
//       res.send(error.message);
//     }
//   } else res.send({ error: "pass valid task id" });
// });

router.post("/priority", async (req, res) => {
  const { headers, body: data } = req;
  const { _id: create_by, role } = get_token_data({ headers });
  const { task_id, priority } = data;
  if (role != "admin") {
    res.status(401).send({ error: "You can't change priority" });
    return;
  }
  if (task_id?.length === 24) {
    try {
      const condition = { create_by, _id: task_id };
      const value = { $set: { priority } };
      const response = await Task_schema.updateOne(condition, value, {
        runValidators: true, //to check schema level validation
      });
      if (response.modifiedCount) res.send({ success: true });
      else res.status(401).send({ success: false });
    } catch (error) {
      res.status(401).send(error.message);
    }
  } else res.status(401).send({ error: "pass valid task id" });
});

router.post("/status", async (req, res) => {
  const { headers, body: data } = req;
  const { _id, role } = get_token_data({ headers });


  const assigned_to = _id; //for user
  const { task_id, status } = data;
  if (task_id?.length === 24) {
    try {
      const condition = { assigned_to, _id: task_id };
      const value = { $set: { status } };
      const response = await Task_schema.updateOne(condition, value, {
        runValidators: true, //to check schema level validation
      });
      if (response.modifiedCount) res.send({ success: true });
      else res.status(401).send({ success: false });
    } catch (error) {
      res.status(401).send(error.message);
    }
  } else res.status(401).send({ error: "pass valid task id" });
});

router.post("/assign", async (req, res) => {
  const { headers, body: data } = req;
  const { _id: create_by, role } = get_token_data({ headers });
  if (role != "admin") {
    res.status(401).send({ error: "You can't assign task" });
    return;
  }

  const { task_id, assigned_to } = data;
  if (task_id?.length === 24) {
    try {

      const condition = { create_by, _id: task_id };

      const value = { $set: { assigned_to } };

      const response = await Task_schema.updateOne(condition, value, {});

      if (response.modifiedCount) res.send({ success: true });
      else res.status(401).send({ success: false, response });
    } catch (error) {
      res.status(401).send(error);
    }
  } else res.status(401).send({ error: "pass valid task id" });
});

router.post("/update", async (req, res) => {

  const { headers, body: data } = req;
  const { _id: create_by, role } = get_token_data({ headers });
  if (role != "admin") {
    res.status(401).send({ error: "You can't assign task" });
    return;
  }
  const { task_id, title, description,due_date } = data;
       
 
  const { error } = task_edit_val({ data });
  if (error) {

    res.status(401).send({ error });
  } else {

    

    try {

      const condition = { create_by, _id: task_id };

      const value = { $set: { title, description, due_date } };

      const response = await Task_schema.updateOne(condition, value, {});
      
      if (response.modifiedCount) res.send({ success: true });
      else res.send({ success: false, response });
    } catch (error) {
     
      res.status(401).send(error.message);
    }
  }

});


router.post("/delete", async (req, res) => {
  const { headers, body: data } = req;
  const { _id: create_by } = get_token_data({ headers });

  const { error } = del_val({ data });
  if (error) {
    res.status(401).send({ error });
    return;
  } else {
    const { task_id } = data;

    try {
      const result = await Task_schema.deleteOne({ _id: task_id, create_by });
      if (result.deletedCount === 1) {
        res.send({ success: true });
        return;
      } else {
        res.status(401).send({ error: "No document found with this ID" });
        return;
      }
    } catch (error) {
      res.status(401).send(error.message);
    }
  }
});

// only user can view there own task

router.post("/userTask", async (req, res) => {
  const { headers, body: data } = req;
  const { _id: assigned_to } = get_token_data({ headers });
  // console.log(assigned_to);
  if (assigned_to?.length === 24) {
    const response = await Task_schema.find({ assigned_to });
    // console.log("a")
    res.send(response);
  } else res.status(401).send({ error: "pass valid task id" });

});
module.exports = router;
