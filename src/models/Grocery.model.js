const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.addIngredientToMeal = async function (userId, mealId, ingredientName) {
  // 1️⃣ Check if ingredient already exists for this user
  let ingredient = await prisma.ingredient.findFirst({
    where: { userId, name: ingredientName },
  });

  // 2️⃣ If ingredient doesn't exist, create it
  let message;
  if (!ingredient) {
    ingredient = await prisma.ingredient.create({
      data: {
        userId,
        name: ingredientName,
        status: "IN_STOCK",
        purchaseStatus: "PENDING",
      },
    });
    message = "Ingredient created and added to meal.";
  } else {
    message = "Ingredient already exists for this user.";
  }

  // 3️⃣ Check if this ingredient is already assigned to the meal
  let mealIngredient = await prisma.mealIngredient.findUnique({
    where: {
      mealId_ingredientId: {
        mealId,
        ingredientId: ingredient.id,
      },
    },
  });

  // 4️⃣ If not, create MealIngredient
  if (!mealIngredient) {
    mealIngredient = await prisma.mealIngredient.create({
      data: {
        mealId,
        ingredientId: ingredient.id,
        quantity: 0, // default
      },
    });
    message += " Added to this meal.";
  } else {
    message += " Already assigned to this meal.";
  }

  return { mealIngredient, message };
};



module.exports.updateMealIngredientQuantity = async function (userId, mealId, ingredientId, quantity) {
  // Optional: check if the meal belongs to the user
  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      userMeal: {
        userId: userId,
      },
    },
  });

  if (!meal) {
    throw new Error("Meal not found or does not belong to user.");
  }

  // Update the quantity
  const updatedMealIngredient = await prisma.mealIngredient.update({
    where: {
      mealId_ingredientId: {
        mealId,
        ingredientId,
      },
    },
    data: {
      quantity,
    },
    include: {
      ingredient: true, // optional: return ingredient details
    },
  });

  return updatedMealIngredient;
};

module.exports.updateIngredientStatus = async function (userId, ingredientId, status) {
  // Ensure ingredient belongs to the user
  const ingredient = await prisma.ingredient.findFirst({
    where: { id: ingredientId, userId },
  });

  if (!ingredient) throw new Error("Ingredient not found or does not belong to user.");

  const updatedIngredient = await prisma.ingredient.update({
    where: { id: ingredientId },
    data: { status },
  });

  return updatedIngredient;
};
