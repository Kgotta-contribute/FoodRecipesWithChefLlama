export async function getRecipeFromMistral(ingredientsArr) {
    try {
        const response = await fetch("/api/generateRecipe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ingredients: ingredientsArr,
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to generate recipe from backend proxy.");
        }

        return await response.json();
    } catch (err) {
        console.error("Recipe Generation Error:", err.message);
        throw new Error(err.message || "Failed to generate recipe.");
    }
}

