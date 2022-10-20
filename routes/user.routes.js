const {signup ,signin ,updateStudent ,deleteStudent}  = require('../controllers/user')
const {authUser} = require('../middlewares/userAuth')
const express = require("express")
const router = express.Router();
router.post("/signup" , signup)
router.post("/signin" , signin)
router.post("/updateStudent",authUser , updateStudent)
router.delete("/deleteStudent",authUser , deleteStudent)
module.exports = router;