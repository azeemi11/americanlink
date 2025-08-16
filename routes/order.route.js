const express = require('express');
const { AddOrder, GetOrders, DeleteOrder, UpdateOrder ,OrderByid,OrderByuserid} = require("../controllers/order.controller.js");

const router = express.Router();

router.post("/", AddOrder);
router.get("/", GetOrders);
router.get("/:id", OrderByid);
router.get("/user/:id", OrderByuserid);
router.delete("/:id", DeleteOrder);
router.put("/:id", UpdateOrder);

module.exports = router;
