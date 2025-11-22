const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const { getCards, createCard, updateCard, deleteCard, moveCard } = require("../controllers/cardController");

const router = express.Router();

// UPDATE, DELETE, MOVE Cards Operations
router.put("/:cardId", authenticateToken, updateCard);
router.delete("/:cardId", authenticateToken, deleteCard);
router.patch("/:cardId/move", authenticateToken, moveCard);

module.exports = router;
