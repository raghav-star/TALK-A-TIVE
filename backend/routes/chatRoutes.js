const express=require("express");
const { accessChat, fetchData,createGroup, renameGroup, removeFromGroup, addToGroup } = require("../controller/chatController");
const { protect } = require("../middleware/authMiddleware");
const router=express.Router();

router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchData);
router.route("/createGroup").post(protect,createGroup)
router.route("/renameGroup").put(protect,renameGroup);
router.route("/removeFromGroup").put(protect,removeFromGroup);
router.route("/addToGroup").put(protect,addToGroup);


module.exports=router;