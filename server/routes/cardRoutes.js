const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
} = require("../controllers/cardController");

const router = express.Router();

router.get("/columns/:columnId/cards", authenticateToken, getCards);
router.post("/columns/:columnId/cards", authenticateToken, createCard);
router.put("/cards/:cardId", authenticateToken, updateCard);
router.delete("/cards/:cardId", authenticateToken, deleteCard);
router.patch("/cards/:cardId/move", authenticateToken, moveCard);

module.exports = router;
