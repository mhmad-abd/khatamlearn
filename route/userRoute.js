const express = require("express")
const auth = require("../middleware/authentication")
const router = express.Router()
const userController = require("../controller/userController")

router.get("/dashboard",auth, userController.getUsers)
router.post("/logout", auth, userController.logout)
router.put("/edit", auth, userController.updateUser)
router.delete("/delete", auth, userController.deleteUser)
router.post('/login',userController.login)
router.post('/register',userController.register)

module.exports = router