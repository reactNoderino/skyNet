const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const { getBoards, createBoard, updateBoard, deleteBoard } = require("../controllers/boardController");

const { createColumn, getColumns } = require("../controllers/columnController");

const router = express.Router();

// Board CRUD
router.get("/", authenticateToken, getBoards);
router.post("/", authenticateToken, createBoard);
router.put("/:boardId", authenticateToken, updateBoard);
router.delete("/:boardId", authenticateToken, deleteBoard);

// Column under board
router.post("/:boardId/columns", authenticateToken, createColumn);
router.get("/:boardId/columns", authenticateToken, getColumns);

module.exports = router;
