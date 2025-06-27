const express = require("express")
const auth = require("../middleware/authentication")
const router = express.Router()
const userController = require("../controller/userController")

router.get("/user/dashboard",auth, userController.getUsers)
router.post("/user/logout", auth, userController.logout)
router.put("/user/edit", auth, userController.updateUser)
router.delete("/user/delete", auth, userController.deleteUser)


module.exports = router