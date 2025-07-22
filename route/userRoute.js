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
router.post('/save/:videoid',auth,userController.savedVideo)
router.get('/video/saved',auth,userController.getSavedVideo)

module.exports = router