import React, { useState } from 'react';

const RecipeCard = () => {
    const [checkedIngredients, setCheckedIngredients] = useState({});

    const toggleIngredient = (index) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const ingredients = [
        "1 cup (2 sticks) unsalted butter, softened to room temperature",
        "1 ½ cups granulated sugar",
        "4 ounces unsweetened chocolate, melted and cooled",
        "1 ½ teaspoons vanilla extract",
        "4 large eggs, pasteurized (room temperature)",
        "1 pre-baked 9-inch pie crust (homemade or store-bought)",
        "Whipped cream and chocolate shavings for garnish"
    ];

    const instructions = [
        "Cream the butter and sugar together in a stand mixer on medium-high speed until light and fluffy (about 3-4 minutes).",
        "Add the melted (and cooled!) chocolate and vanilla extract. Beat until incorporated.",
        "Add the eggs, one at a time, beating for 5 minutes after EACH addition. This is the secret to the silky texture!",
        "Pour the filling into the prepared pie crust and smooth the top.",
        "Refrigerate for at least 6 hours, preferably overnight.",
        "Top with whipped cream and chocolate shavings before serving."
    ];

    return (
        <div className="bg-white rounded-2xl shadow-card border-2 border-terracotta overflow-hidden my-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-cream p-8 border-b-2 border-terracotta relative">
                <h2 className="text-4xl font-heading font-bold text-brown mb-2">The Pie That Started a Dynasty</h2>
                <p className="text-brown-light italic font-body text-lg">Rich, decadent French Silk Pie that demands respect.</p>

                <div className="flex gap-4 mt-6">
                    <button className="bg-copper text-white px-6 py-2 rounded-lg hover:bg-brown transition-colors shadow-md" onClick={() => window.print()}>
                        Print Recipe
                    </button>
                    <button className="bg-terracotta text-brown px-6 py-2 rounded-lg hover:bg-cream border-2 border-terracotta transition-colors shadow-md">
                        Pin It
                    </button>
                </div>

                {/* Decorative Badge */}
                <div className="absolute top-4 right-4 bg-lavender text-brown font-heading font-bold px-4 py-1 rounded-full transform rotate-3 shadow-sm">
                    Giselle Approved
                </div>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Main Content */}
                <div className="p-8 md:w-2/3">
                    <div className="mb-8">
                        <h3 className="text-2xl font-heading font-bold text-copper mb-4 border-b border-terracotta pb-2">Ingredients</h3>
                        <ul className="space-y-3">
                            {ingredients.map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-3 group cursor-pointer" onClick={() => toggleIngredient(idx)}>
                                    <div className={`w-6 h-6 rounded border-2 border-copper flex items-center justify-center transition-colors ${checkedIngredients[idx] ? 'bg-copper' : 'bg-transparent'}`}>
                                        {checkedIngredients[idx] && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className={`font-body text-lg ${checkedIngredients[idx] ? 'text-brown-light line-through decoration-copper' : 'text-brown'}`}>
                                        {ing}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-heading font-bold text-copper mb-4 border-b border-terracotta pb-2">Instructions</h3>
                        <ol className="space-y-6">
                            {instructions.map((step, idx) => (
                                <li key={idx} className="flex gap-4">
                                    <span className="font-heading font-bold text-3xl text-terracotta opacity-50">{idx + 1}</span>
                                    <p className="font-body text-lg text-brown pt-1">{step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* Sidebar - Sheltie Tips */}
                <div className="bg-cream/50 p-8 md:w-1/3 border-l-2 border-terracotta/30">
                    <div className="sticky top-8">
                        <h3 className="text-xl font-heading font-bold text-brown mb-4 flex items-center gap-2">
                            <span className="text-2xl">🐾</span> Sheltie Tips
                        </h3>

                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl border border-lavender shadow-soft">
                                <p className="font-heading font-bold text-copper mb-1">Giselle says:</p>
                                <p className="text-sm italic text-brown">"If you use margarine instead of butter, I will know. And I will judge you."</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-terracotta shadow-soft">
                                <p className="font-heading font-bold text-copper mb-1">Tiana says:</p>
                                <p className="text-sm italic text-brown">"Licking the beater is the best part! Make sure to leave some for the 'pre-wash' crew!"</p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-brown/10">
                                <h4 className="font-heading font-bold text-brown mb-3">Stacey's Essentials</h4>
                                <ul className="text-sm space-y-2">
                                    <li><a href="#" className="text-copper hover:text-brown underline">My Favorite Stand Mixer</a></li>
                                    <li><a href="#" className="text-copper hover:text-brown underline">The Perfect Pie Plate</a></li>
                                    <li><a href="#" className="text-copper hover:text-brown underline">Good Vanilla Extract</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
