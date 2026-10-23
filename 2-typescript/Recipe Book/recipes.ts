type Ingredient = {
    name: string;
    amountGrams: number;
};

type Recipe = {
    name: string, servings: number, vegetarian: boolean, ingredients: Ingredient[]
};

const recipeOne: Recipe =
{
    name: "Spaghetti Bolognese",
    servings: 4,
    vegetarian: false,
    ingredients: [
        { name: "Spaghetti", amountGrams: 400 },
        { name: "Ground Beef", amountGrams: 500 },
        { name: "Tomato Sauce", amountGrams: 300 },
        { name: "Onion", amountGrams: 100 },
        { name: "Garlic", amountGrams: 10 },
    ],
}

const recipeTwo: Recipe = {
    name: "Vegetable Stir Fry",
    servings: 2,
    vegetarian: true,
    ingredients: [
        { name: "Broccoli", amountGrams: 200 },
        { name: "Carrots", amountGrams: 150 },
        { name: "Bell Peppers", amountGrams: 100 },
        { name: "Soy Sauce", amountGrams: 30 },
        { name: "Tofu", amountGrams: 200 },
    ]
}


const summarize = (recipe: Recipe): string => {
    const diet = recipe.vegetarian ? "vegetarian" : "not vegetarian";
    const names = recipe.ingredients.map((i) => i.name).join(", ");
    return `${recipe.name} (${recipe.servings} servings, ${diet}): ${names}`;
}

const recipes: Recipe[] = [recipeOne, recipeTwo];
for (const recipe of recipes) {
    console.log(summarize(recipe));
}
