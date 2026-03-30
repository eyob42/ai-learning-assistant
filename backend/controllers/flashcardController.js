import Flashcard from "../models/Flashcard";

//@desc   GET all flashcards for a document
//@route  GET /api/flashcards/:documentId
//@access Private

export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

//@desc   GET all flashcards for a user
//@route  GET /api/flashcards
//@access Private

export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({ userId: req.user._id })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Mark flashcard as reviewed
//@route  POST /api/flashcards/:cardId/review
//@access Private

export const reviewFlashCard = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSets) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const cardIndex = flashcardSets.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId,
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Card not found in set",
        statusCode: 404,
      });
    }

    //Update review info
    flashcardSets.cards[cardIndex].lastReviewed = new Data();
    flashcardSets.cards[cardIndex].reviewCount += 1;

    await flashcardSets.save();

    res.status(200).json({
      success: true,
      data: flashcardSets,
      message: "Flashcard reviewed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Toggle star/favorite on flashcard
//@route  PUT /api/flashcards/:cardId/star
//@access Private

export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSets) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const cardIndex = flashcardSets.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId,
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Card not found in set',
        statusCode: 404,
      });
    }

    //Toggle star
    flashcardSets.cards[cardIndex].isStarred = !flashcardSets.cards[cardIndex].isStarred;

    await flashcardSets.save();


    res.status(200).json({
        success: true,
        data: flashcardSets,
        message: `Flashcard ${flashcardSets.cards[cardIndex].isStarred ? 'starred' : 'unStarred'}`
    })
  } catch (error) {
    next(error);
  }
};


// @desc  Delete flashcard set
//@route  DELETE /api/flashcards/:Id
//@access Private

export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!flashcardSets) {
        return res.statusCode(404).json({
            success: false,
            error: 'Flashcard set not found',
            statusCode: 404
        });
    }

    await flashcardSets.deleteOne();

    res.status(200).json({
        success: true,
        data: flashcardSets,
        message: 'Flashcard set deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
