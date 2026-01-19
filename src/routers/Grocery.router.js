const express = require("express");
const router = express.Router();
const groceryModel = require("../models/Grocery.model");
const authMiddleware = require("../middlewares/authMiddleware");

// POST /grocery/add-ingredients
router.post("/add-ingredients", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { mealId, ingredientName } = req.body;

    if (!mealId || !ingredientName) {
      return res.status(400).json({ error: "mealId and ingredientName are required" });
    }

    const result = await groceryModel.addIngredientToMeal(userId, mealId, ingredientName);
    res.json(result); // includes { mealIngredient, message }
  } catch (err) {
    next(err);
  }
});


// PUT /grocery/update-quantity/:mealId
router.put("/update-quantity/:mealId", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const mealId = parseInt(req.params.mealId, 10);
    const { ingredientId, quantity } = req.body;

    if (!ingredientId || quantity === undefined) {
      return res.status(400).json({ error: "ingredientId and quantity are required" });
    }

    const updatedMealIngredient = await groceryModel.updateMealIngredientQuantity(
      userId,
      mealId,
      ingredientId,
      quantity
    );

    res.json({ success: true, updatedMealIngredient });
  } catch (err) {
    next(err);
  }
});

// PUT /grocery/update-ingredient-status/:ingredientId
router.put("/update-ingredient-status/:ingredientId", authMiddleware, async (req, res, next) => {
  try {
    const ingredientId = parseInt(req.params.ingredientId, 10);
    const userId = req.user.userId;
    const { status } = req.body;

    if (!["IN_STOCK", "RUNNING_OUT", "OUT_OF_STOCK"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedIngredient = await groceryModel.updateIngredientStatus(userId, ingredientId, status);
    res.json({ success: true, updatedIngredient });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
