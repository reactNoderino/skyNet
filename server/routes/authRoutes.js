const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/profile", protect, upload.single("avatar"), updateProfile);
module.exports = router;
