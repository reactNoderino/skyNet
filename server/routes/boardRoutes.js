const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");

const router = express.Router();

router.get("/", authenticateToken, getBoards);
router.post("/", authenticateToken, createBoard);
router.put("/:id", authenticateToken, updateBoard);
router.delete("/:id", authenticateToken, deleteBoard);

module.exports = router;
