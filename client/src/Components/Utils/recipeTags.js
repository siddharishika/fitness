/** Curated tags for recipes (meal type, diet, cooking style). */
export const RECIPE_TAGS = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Healthy",
  "High Protein",
  "Low Carb",
  "Low Calorie",
  "High Fiber",
  "Vegan",
  "Vegetarian",
  "Gluten Free",
  "Dairy Free",
  "Keto",
  "Sugar Free",
  "Quick & Easy",
  "Meal Prep",
  "One Pot",
  "No Cook",
  "Baking",
  "Soup",
  "Salad",
  "Smoothie",
  "Grilled",
  "Air Fryer",
  "Comfort Food",
  "Party",
  "Holiday",
];

export function normalizeTags(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

/** Merge predefined recipe tags with any legacy/existing tags already on a recipe. */
export function mergeRecipeTagOptions(predefinedTags = RECIPE_TAGS, existingTags = []) {
  const merged = [...predefinedTags];
  normalizeTags(existingTags).forEach((tag) => {
    if (!merged.includes(tag)) {
      merged.push(tag);
    }
  });
  return merged;
}
