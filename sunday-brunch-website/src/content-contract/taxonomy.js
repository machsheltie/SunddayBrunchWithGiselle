// Canonical recipe taxonomy (D-10, 2026-06-18).
// Registered controlled vocabulary for recipe category tags. The validator
// rejects any tag outside these sets; adding a value is a deliberate edit here,
// never a silent expansion. Curated brand collections are Collection records
// referenced by `collectionIds`, not part of this vocabulary.

export const recipeTaxonomies = {
    course: [
        'Breakfast & Brunch',
        'Appetizers & Snacks',
        'Sides',
        'Soups & Salads',
        'Main Dishes',
        'Desserts',
        'Drinks'
    ],
    dishType: [
        'Pies & Tarts',
        'Cakes',
        'Cupcakes',
        'Cookies',
        'Bars & Brownies',
        'Breads',
        'Muffins & Scones',
        'Pastries',
        'Candy & Confections',
        'Frostings, Sauces & Fillings'
    ],
    mainIngredients: [
        'Chocolate',
        'Vanilla',
        'Fruit',
        'Apple',
        'Berry',
        'Citrus',
        'Stone Fruit',
        'Caramel',
        'Coffee',
        'Nuts',
        'Pumpkin & Spice',
        'Cheese'
    ],
    methods: [
        'No-Bake / Chilled',
        'Baked',
        'Make-Ahead',
        'Stand-Mixer',
        'One-Bowl',
        'Frozen',
        'Grilled'
    ],
    occasions: [
        'Birthdays',
        "Valentine's Day",
        'Thanksgiving',
        'Christmas & Winter Holidays',
        'Easter',
        'Game Day',
        'Potlucks',
        'Date Night',
        'Celebrations'
    ],
    seasons: [
        'Spring',
        'Summer',
        'Fall',
        'Winter',
        'All Seasons'
    ],
    dietary: [
        'Vegetarian',
        'Gluten-Free',
        'Dairy-Free',
        'Egg-Free',
        'Nut-Free',
        'Vegan',
        'Refined-Sugar-Free'
    ]
}

export const recipeDifficultyLevels = [
    'Beginner',
    'Intermediate',
    'Advanced'
]
