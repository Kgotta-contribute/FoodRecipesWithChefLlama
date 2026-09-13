import { forwardRef } from "react";

// forwardRef lets the parent pass a ref that attaches to the CTA div.
const IngredientsList = forwardRef(function IngredientsList(props, ref) {
    return (
        <section>
            <div className="ingredients-list-parent">
                <h2>Ingredients at hand:</h2>
                <ul className="ingredients-list">
                    {props.ingredientsList.map((ingredient, index) => {
                        return (
                            <li key={ingredient} className="ingredient-item">
                                <span className="ingredient-name">{ingredient}</span>
                                <button 
                                    className="remove-ingredient-btn" 
                                    onClick={() => props.removeIngredient(index)}
                                    aria-label={`Remove ${ingredient}`}
                                    type="button"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="trash-icon">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {props.ingredientsList.length > 3 &&
                <div ref={ref} className="cta-container">
                    <div className="cta-container-left">
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button onClick={props.getRecipe} disabled={props.loading}>
                        {props.loading ? "Generating..." : "Get a recipe"}
                    </button>
                </div>
            }
        </section>
    )
});

export default IngredientsList;