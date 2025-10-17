// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.loginAdmin);

router.post("/register", adminController.registerAdmin);
router.get("/", adminController.getAllAdmins);
router.get("/:email", adminController.getAdminByEmail);
router.put("/update-password", adminController.updatePassword);
router.delete("/:email", adminController.deleteAdmin);
router.post("/logout", adminController.logoutAdmin);

module.exports = router;
