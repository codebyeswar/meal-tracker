
// Ingredient database (example)
const ingredientDatabase = {
  "Proteins": {
      "Chicken": { protein: 27, carbs: 0, calories: 239, fat: 14 },
      "Egg": { protein: 13, carbs: 1.1, calories: 155, fat: 11 },
      "Cheese": { protein: 25, carbs: 1.3, calories: 402, fat: 33 },
      "Milk": { protein: 3.4, carbs: 5, calories: 42, fat: 1 }
  },
  "Grains": {
      "Rice": { protein: 2.7, carbs: 28, calories: 130, fat: 0.3 },
      "Wheat": { protein: 13, carbs: 72, calories: 339, fat: 2.5 },
      "Oats": { protein: 11, carbs: 66, calories: 389, fat: 6.9 },
      "Corn": { protein: 9, carbs: 74, calories: 365, fat: 4.7 }
  },
  "Vegetables": {
      "Tomato": { protein: 0.9, carbs: 3.9, calories: 18, fat: 0.2 },
      "Onion": { protein: 1.1, carbs: 9.3, calories: 40, fat: 0.1 },
      "Broccoli": { protein: 2.8, carbs: 6.6, calories: 55, fat: 0.6 },
      "Spinach": { protein: 2.9, carbs: 3.6, calories: 23, fat: 0.4 },
      "Carrot": { protein: 0.9, carbs: 9.6, calories: 41, fat: 0.2 }
  },
  "Spices": {
      "Garlic": { protein: 6.4, carbs: 33, calories: 149, fat: 0.5 },
      "Pepper": { protein: 2, carbs: 9, calories: 40, fat: 0.4 },
      "Turmeric": { protein: 8, carbs: 67, calories: 312, fat: 3.3 },
      "Cumin": { protein: 18, carbs: 44, calories: 375, fat: 22 }
  },
  "Dairy": {
      "Butter": { protein: 0.9, carbs: 0.1, calories: 717, fat: 81 },
      "Yogurt": { protein: 10, carbs: 3.6, calories: 59, fat: 0.4 },
      "Cream": { protein: 2, carbs: 4, calories: 195, fat: 19 }
  },
  "Oils": {
      "Olive Oil": { protein: 0, carbs: 0, calories: 884, fat: 100 },
      "Coconut Oil": { protein: 0, carbs: 0, calories: 862, fat: 100 },
      "Vegetable Oil": { protein: 0, carbs: 0, calories: 884, fat: 100 }
  },
  "Legumes": {
      "Lentils": { protein: 9, carbs: 20, calories: 116, fat: 0.4 },
      "Chickpeas": { protein: 19, carbs: 61, calories: 364, fat: 6 },
      "Beans": { protein: 21, carbs: 60, calories: 347, fat: 1.6 }
  }
};

let selectedIngredients = [];



const searchInput = document.getElementById("ingredient-search");
const searchBox = searchInput.parentElement; // Get the search box div

// Ensure the suggestions appear inside the search box
const suggestionBox = document.createElement("div"); 
suggestionBox.classList.add("suggestions");
searchBox.appendChild(suggestionBox);
searchBox.style.position = "relative"; // Ensure parent has position

// Show suggestions when typing
function updateIngredientSuggestions() {
    const query = searchInput.value.toLowerCase();
    suggestionBox.innerHTML = ""; // Clear previous suggestions

    let availableIngredients = [];

    // Ensure selectedCategory is defined
    if (!selectedCategory) {
        selectedCategory = "all";
    }

    // Get ingredients based on category selection
    if (selectedCategory === "all") {
        Object.keys(ingredientDatabase).forEach(category => {
            availableIngredients.push(...Object.keys(ingredientDatabase[category]));
        });
    } else {
        availableIngredients = Object.keys(ingredientDatabase[selectedCategory] || {});
    }

    // Filter ingredients based on user input
    const matches = availableIngredients.filter(item => item.toLowerCase().includes(query));

    // Display matching suggestions
    matches.forEach(match => {
        const suggestion = document.createElement("div");
        suggestion.textContent = match;
        suggestion.classList.add("suggestion-item");
        suggestion.addEventListener("click", function () {
            searchInput.value = match; // Set input to selected item
            suggestionBox.innerHTML = ""; // Hide suggestions
        });
        suggestionBox.appendChild(suggestion);
    });
}


// Ensure the ingredient list updates when typing
searchInput.addEventListener("input", updateIngredientSuggestions);


// Hide suggestions when clicking outside
document.addEventListener("click", function (event) {
    if (!searchBox.contains(event.target)) {
        suggestionBox.innerHTML = "";
    }
});




const categoryButtons = document.querySelectorAll(".tab-btn");
let selectedCategory = "all"; // Default category

categoryButtons.forEach(button => {
    button.addEventListener("click", function () {
        categoryButtons.forEach(btn => btn.classList.remove("active")); // Remove active from all
        this.classList.add("active"); // Add active to clicked button
        selectedCategory = this.dataset.category; // Get selected category
        updateIngredientSuggestions(); // Update ingredient list based on category
    });
});



document.getElementById("add-ingredient").addEventListener("click", function () {
    const name = document.getElementById("ingredient-search").value;
    const quantity = parseFloat(document.getElementById("ingredient-quantity").value);

    if (!name || isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid ingredient and quantity.");
        return;
    }

    let ingredientData = null;

    // Find ingredient in the database
    for (let category in ingredientDatabase) {
        if (ingredientDatabase[category][name]) {
            ingredientData = ingredientDatabase[category][name];
            break;
        }
    }

    if (!ingredientData) {
        alert("Ingredient not found!");
        return;
    }

    // Calculate nutrition values based on quantity
    const ingredient = {
        name,
        quantity,
        calories: (quantity * ingredientData.calories) / 100,
        protein: (quantity * ingredientData.protein) / 100,
        carbs: (quantity * ingredientData.carbs) / 100,
        fat: (quantity * ingredientData.fat) / 100
    };

    selectedIngredients.push(ingredient);
    updateDishSummary();
});

// Refresh ingredient list
document.getElementById("refresh-ingredients").addEventListener("click", function () {
    document.getElementById("ingredient-search").value = "";
    document.getElementById("ingredient-quantity").value = "";
});

// Clear all selected ingredients
document.getElementById("clear-all").addEventListener("click", function () {
  selectedIngredients = [];
  updateDishSummary();
});

// Function to remove only clicked item




// Portion Calculation
document.getElementById("calculate-portion").addEventListener("click", function () {
  const portionSize = parseFloat(document.getElementById("portion-size").value);

  if (portionSize > 0 && selectedIngredients.length > 0) {
      let totalWeight = selectedIngredients.reduce((sum, item) => sum + item.quantity, 0);
      let factor = portionSize / totalWeight;
      let portionCalories = selectedIngredients.reduce((sum, item) => sum + (item.calories * factor), 0);

      document.getElementById("portion-total").textContent = `Total Calories: ${portionCalories.toFixed(2)} kcal`;
  }
});


function updateDishSummary() {
    const list = document.getElementById("item-display");
    list.innerHTML = "";

    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

    selectedIngredients.forEach((item, index) => {
        totalCalories += item.calories;
        totalProtein += item.protein;
        totalCarbs += item.carbs;
        totalFat += item.fat;

        const div = document.createElement("div");
        div.textContent = `${item.name} - ${item.quantity}g`;
        div.classList.add("item");
        div.dataset.index = index;

        div.addEventListener("click", function () {
            selectedIngredients.splice(index, 1);
            updateDishSummary(); // Refresh when an item is removed
            updateChartFromDish(); // Ensure chart updates when an item is removed
        });

        list.appendChild(div);
    });

    // **Update Total Nutrition Boxes**
    document.getElementById("box-total-calories").textContent = `Calories: ${totalCalories.toFixed(2)} kcal`;
    document.getElementById("box-total-protein").textContent = `Protein: ${totalProtein.toFixed(2)} g`;
    document.getElementById("box-total-carbs").textContent = `Carbs: ${totalCarbs.toFixed(2)} g`;
    document.getElementById("box-total-fat").textContent = `Fat: ${totalFat.toFixed(2)} g`;

    // **Ensure the chart updates dynamically from the dish section**
    updateChartFromDish();
}





let chartInstance = null; // Store the chart instance globally

function updateChartFromDish() {
    const ctx = document.getElementById("nutritionChart").getContext("2d");

    // Read numeric values from the total nutrition boxes
    let totalCalories = parseFloat(document.getElementById("box-total-calories").textContent.replace(/\D/g, '')) || 0;
    let totalProtein = parseFloat(document.getElementById("box-total-protein").textContent.replace(/\D/g, '')) || 0;
    let totalCarbs = parseFloat(document.getElementById("box-total-carbs").textContent.replace(/\D/g, '')) || 0;
    let totalFat = parseFloat(document.getElementById("box-total-fat").textContent.replace(/\D/g, '')) || 0;

    if (chartInstance) {
        // **Update the existing chart with new data**
        chartInstance.data.datasets[0].data = [totalCalories, totalProtein, totalCarbs, totalFat];
        chartInstance.update(); // Refresh the chart to reflect changes
    } else {
        // **Create the chart only once**
        chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Calories", "Protein", "Carbs", "Fat"],
                datasets: [{
                    label: "Nutritional Breakdown",
                    data: [totalCalories, totalProtein, totalCarbs, totalFat],
                    backgroundColor: ["red", "blue", "green", "yellow"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // Hide labels
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { precision: 0 } // Ensure whole number values
                    }
                }
            }
        });
    }
}
