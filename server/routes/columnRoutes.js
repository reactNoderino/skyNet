const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} = require("../controllers/columnController");

const router = express.Router();

// Boards routes
router.get("/boards/:boardId/columns", authenticateToken, getColumns);
router.post("/boards/:boardId/columns", authenticateToken, createColumn);

// Column routes
router.put("/columns/:columnId", authenticateToken, updateColumn);
router.delete("/columns/:columnId", authenticateToken, deleteColumn);

module.exports = router;
