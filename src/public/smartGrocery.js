const apiUrl = "."; // API base URL
const token = localStorage.getItem("token");

if (!token) {
  alert("You must be logged in to view meals.");
}

// State
const state = {
  meals: [],
  token,
};

// Containers
const mealContainer = document.querySelector(".meal-container");

// Fetch meals + ingredients from backend
// Fetch meals + ingredients from backend
async function fetchMeals() {
  try {
    const response = await fetch(`${apiUrl}/nutrition/meals`, {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });
    const data = await response.json();

    // Extract meals from the UserMeal object
    state.meals = data.meals || [];

    console.log("Fetched meals:", state.meals); // ✅ now shows array of meals directly

    renderMeals();
  } catch (err) {
    console.error("Error fetching meals:", err);
  }
}


// Render all meals
function renderMeals() {
  mealContainer.innerHTML = ""; // clear container

  state.meals.forEach((meal) => {
    const mealCard = document.createElement("section");
    mealCard.className = "meal-card";

    // Meal Header
    const header = document.createElement("div");
    header.className = "meal-header";
    header.innerHTML = `
      <h2>${meal.mealName}</h2>
      <span class="meal-type">${meal.mealType}</span>
    `;
    mealCard.appendChild(header);

    // Ingredients List
    const ingredientList = document.createElement("div");
    ingredientList.className = "ingredient-list";

    meal.mealIngredients.forEach((mi) => {
      const row = document.createElement("div");
      row.className = "ingredient-row";

      const name = document.createElement("span");
      name.className = "ingredient-name";
      name.textContent = mi.ingredient.name;

      const input = document.createElement("input");
      input.type = "number";
      input.value = mi.quantity || 0;
      input.min = 0;
      input.className = "quantity-input";

      // Save quantity on change
      input.addEventListener("change", () => {
        updateMealIngredientQuantity(meal.id, mi.ingredient.id, parseFloat(input.value));
      });

      row.appendChild(name);
      row.appendChild(input);
      ingredientList.appendChild(row);
    });

    // ✅ Add "Add Ingredients" button at bottom of list
    const addBtn = document.createElement("button");
    addBtn.className = "btn primary add-ingredient-btn";
    addBtn.textContent = "+ Add Ingredients";
    addBtn.addEventListener("click", () => {
      const ingredientName = prompt("Enter ingredient name:");
      if (ingredientName) {
        addIngredientToMeal(meal.id, ingredientName);
      }
    });
    ingredientList.appendChild(addBtn);

    mealCard.appendChild(ingredientList);

    // ...rest of renderMeals remains unchanged


    // Action Buttons
    const actions = document.createElement("div");
    actions.className = "meal-actions";
    actions.innerHTML = `
      <button class="btn secondary guide-btn">Guide</button>
      <button class="btn primary shopping-btn">Start Shopping</button>
    `;
    mealCard.appendChild(actions);

    // Curtains
    const guideCurtain = createGuideCurtain(meal);
    const shoppingCurtain = createShoppingCurtain(meal);

    mealCard.appendChild(guideCurtain);
    mealCard.appendChild(shoppingCurtain);

    // Button toggle events
    actions.querySelector(".guide-btn").addEventListener("click", () => {
      guideCurtain.style.display = guideCurtain.style.display === "block" ? "none" : "block";
    });

    actions.querySelector(".shopping-btn").addEventListener("click", () => {
      shoppingCurtain.style.display = shoppingCurtain.style.display === "block" ? "none" : "block";
    });

    mealContainer.appendChild(mealCard);
  });
}

function createGuideCurtain(meal) {
  const curtain = document.createElement("div");
  curtain.className = "curtain guide-curtain";

  const title = document.createElement("h3");
  title.textContent = "Cooking Guide";
  curtain.appendChild(title);

  meal.mealIngredients.forEach((mi) => {
    const item = document.createElement("div");
    item.className = "guide-item";

    const name = document.createElement("span");
    name.textContent = mi.ingredient.name;

    // Custom badge dropdown
    const badge = document.createElement("div");
    badge.className = "status-badge " + ingredientStatusClass(mi.ingredient.status);
    badge.textContent = formatStatusText(mi.ingredient.status);
    badge.tabIndex = 0; // make it focusable

    // Options container (hidden by default)
    const options = document.createElement("div");
    options.className = "status-options hidden";

    ["IN_STOCK", "RUNNING_OUT", "OUT_OF_STOCK"].forEach((s) => {
      const option = document.createElement("div");
      option.className = "status-option";
      option.textContent = formatStatusText(s);
      option.dataset.value = s;

      // Click on option
      option.addEventListener("click", async () => {
        const newStatus = option.dataset.value;

        try {
          const response = await fetch(`${apiUrl}/grocery/update-ingredient-status/${mi.ingredient.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify({ status: newStatus }),
          });

          const data = await response.json();
          if (data.success) {
            // Update badge text and color
            badge.textContent = formatStatusText(newStatus);
            badge.className = "status-badge " + ingredientStatusClass(newStatus);
            mi.ingredient.status = newStatus;

            // Close options
            options.classList.add("hidden");
            console.log(data)
          }
        } catch (err) {
          console.error("Error updating ingredient status:", err);
        }
      });

      options.appendChild(option);
    });

    // Toggle options on badge click
    badge.addEventListener("click", () => {
      options.classList.toggle("hidden");
    });

    // Close options if click outside
    document.addEventListener("click", (e) => {
      if (!item.contains(e.target)) {
        options.classList.add("hidden");
      }
    });

    item.appendChild(name);
    item.appendChild(badge);
    item.appendChild(options);
    curtain.appendChild(item);
  });

  // Video placeholder
  const video = document.createElement("div");
  video.className = "video-placeholder";
  video.textContent = "▶ Video Guide Placeholder";
  curtain.appendChild(video);

  return curtain;
}



// Create shopping curtain
function createShoppingCurtain(meal) {
  const curtain = document.createElement("div");
  curtain.className = "curtain shopping-curtain";

  const title = document.createElement("h3");
  title.textContent = "Shopping List";
  curtain.appendChild(title);

  meal.mealIngredients.forEach((mi) => {
    const item = document.createElement("div");
    item.className = "shopping-item";

    const name = document.createElement("span");
    name.textContent = mi.ingredient.name;

    const badge = document.createElement("span");
    badge.className = "badge pending";
    badge.textContent = "Pending";

    item.appendChild(name);
    item.appendChild(badge);
    curtain.appendChild(item);
  });

  return curtain;
}

// Helpers for status
function ingredientStatusClass(status) {
  switch (status) {
    case "IN_STOCK":
      return "in-stock";
    case "RUNNING_OUT":
      return "running-out";
    case "OUT_OF_STOCK":
      return "out-of-stock";
    default:
      return "";
  }
}

function formatStatusText(status) {
  switch (status) {
    case "IN_STOCK":
      return "In Stock";
    case "RUNNING_OUT":
      return "Running Out";
    case "OUT_OF_STOCK":
      return "Out of Stock";
    default:
      return "";
  }
}

// Update meal ingredient quantity (calls backend)
async function updateMealIngredientQuantity(mealId, ingredientId, quantity) {
  try {
    const response = await fetch(`${apiUrl}/grocery/update-quantity/${mealId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({
        ingredientId,
        quantity,
      }),
    });

    const data = await response.json();
    console.log("Updated quantity:", data);
  } catch (err) {
    console.error("Error updating quantity:", err);
  }
}



async function addIngredientToMeal(mealId, ingredientName) {
  try {
    const response = await fetch(`${apiUrl}/grocery/add-ingredients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ mealId, ingredientName }),
    });

    const data = await response.json();
    console.log("Ingredient response:", data);

    // ✅ Alert the user if already exists or added
    if (data.message) {
      alert(data.message);
    }

    // Refresh meals to show the updated list
    fetchMeals();
  } catch (err) {
    console.error("Error adding ingredient:", err);
  }
}


// Initialize
fetchMeals();



