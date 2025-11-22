const Card = require("../models/Card");
const Column = require("../models/Column");
const Board = require("../models/Board");

// Get all cards for a column
const getCards = async (req, res) => {
  try {
    const { columnId } = req.params;

    const column = await Column.findById(columnId).populate("board");

    if (!column) {
      return res.status(404).json({ message: "Kolon bulunamadı" });
    }

    // Check if board belongs to user
    if (column.board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    const cards = await Card.find({ column: columnId }).sort({ order: 1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new card
const createCard = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description, priority, deadline } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Kart başlığı gereklidir" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Kart açıklaması gereklidir" });
    }

    const column = await Column.findById(columnId).populate("board");

    if (!column) {
      return res.status(404).json({ message: "Kolon bulunamadı" });
    }

    // Check if board belongs to user
    if (column.board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    // Get the highest order value
    const lastCard = await Card.findOne({ column: columnId }).sort({
      order: -1,
    });
    const newOrder = lastCard ? lastCard.order + 1 : 0;

    // Validate deadline if provided
    let parsedDeadline = null;
    if (deadline) {
      parsedDeadline = new Date(deadline);
      if (parsedDeadline < new Date()) {
        return res.status(400).json({ message: "Geçmiş tarihi seçemezsiniz" });
      }
    }

    const card = new Card({
      title: title.trim(),
      description: description.trim(),
      priority: priority || "none",
      deadline: parsedDeadline,
      column: columnId,
      order: newOrder,
    });

    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update card
const updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, priority, deadline } = req.body;

    const card = await Card.findById(cardId).populate({
      path: "column",
      populate: "board",
    });

    if (!card) {
      return res.status(404).json({ message: "Kart bulunamadı" });
    }

    // Check if board belongs to user
    if (card.column.board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    // Validate fields
    if (title && !title.trim()) {
      return res.status(400).json({ message: "Kart başlığı boş olamaz" });
    }
    if (description && !description.trim()) {
      return res.status(400).json({ message: "Kart açıklaması boş olamaz" });
    }

    if (title) card.title = title.trim();
    if (description) card.description = description.trim();
    if (priority) card.priority = priority;

    if (deadline !== undefined) {
      if (deadline) {
        const parsedDeadline = new Date(deadline);
        if (parsedDeadline < new Date()) {
          return res
            .status(400)
            .json({ message: "Geçmiş tarihi seçemezsiniz" });
        }
        card.deadline = parsedDeadline;
      } else {
        card.deadline = null;
      }
    }

    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete card
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId).populate({
      path: "column",
      populate: "board",
    });

    if (!card) {
      return res.status(404).json({ message: "Kart bulunamadı" });
    }

    // Check if board belongs to user
    if (card.column.board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    await Card.deleteOne({ _id: cardId });
    res.json({ message: "Kart silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Move card to another column
const moveCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { columnId } = req.body;

    const card = await Card.findById(cardId).populate({
      path: "column",
      populate: "board",
    });

    if (!card) {
      return res.status(404).json({ message: "Kart bulunamadı" });
    }

    // Check if current board belongs to user
    if (card.column.board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    const targetColumn = await Column.findById(columnId).populate("board");

    if (!targetColumn) {
      return res.status(404).json({ message: "Hedef kolon bulunamadı" });
    }

    // Check if target board belongs to user
    if (targetColumn.board.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    // Get the highest order value in target column
    const lastCard = await Card.findOne({ column: columnId }).sort({
      order: -1,
    });
    const newOrder = lastCard ? lastCard.order + 1 : 0;

    card.column = columnId;
    card.order = newOrder;
    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
};
