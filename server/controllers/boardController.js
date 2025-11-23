const Board = require("../models/Board");

// Get all boards for authenticated user
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user.userId });
    res.json(boards);
    console.log(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new board
const createBoard = async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Pano başlığı gereklidir" });
  }

  try {
    const board = new Board({
      title: title.trim(),
      owner: req.user.userId,
    });

    await board.save();
    res.status(201).json(board);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update board title
const updateBoard = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Pano başlığı gereklidir" });
  }

  try {
    const board = await Board.findOne({ _id: id, owner: req.user.userId });

    if (!board) {
      return res.status(404).json({ message: "Pano bulunamadı" });
    }

    board.title = title.trim();
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete board
const deleteBoard = async (req, res) => {
  const { id } = req.params;

  try {
    const board = await Board.findOne({ _id: id, owner: req.user.userId });

    if (!board) {
      return res.status(404).json({ message: "Pano bulunamadı" });
    }

    // Delete all columns and cards related to this board
    const Column = require("../models/Column");
    const Card = require("../models/Card");

    const columns = await Column.find({ board: id });
    const columnIds = columns.map((col) => col._id);

    await Card.deleteMany({ column: { $in: columnIds } });
    await Column.deleteMany({ board: id });

    await Board.deleteOne({ _id: id });
    res.json({ message: "Pano silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
};
