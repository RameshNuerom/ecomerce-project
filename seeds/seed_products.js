// seeds/YYYYMMDDHHMMSS_seed_products.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries in the products table before seeding
  await knex('products').del();

  // Get all category IDs
  const categories = await knex('categories').select('id', 'name');

  if (categories.length === 0) {
    console.warn('No categories found. Please run the category seeder first.');
    return;
  }

  const productsToInsert = [];
  const productNames = [
    "Classic", "Premium", "Sporty", "Elegant", "Casual",
    "Vintage", "Modern", "Lightweight", "Heavy Duty", "Designer"
  ];
  const colors = ["Red", "Blue", "Green", "Black", "White", "Grey", "Pink", "Yellow"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  let productCounter = 0;

  for (const category of categories) {
    for (let i = 0; i < 10; i++) { // 10 products per category
      productCounter++;
      const productNameBase = productNames[Math.floor(Math.random() * productNames.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      const price = (Math.random() * (150 - 20) + 20).toFixed(2); // Price between 20 and 150
      const stock = Math.floor(Math.random() * (200 - 10) + 10); // Stock between 10 and 200

      let name, description;
      if (category.name === 'T-Shirts') {
        name = `${productNameBase} ${randomColor} T-Shirt`;
        description = `Comfortable ${randomColor} ${productNameBase.toLowerCase()} t-shirt in cotton blend. Perfect for everyday wear.`;
      } else if (category.name === 'Jeans') {
        name = `${productNameBase} Fit ${randomColor} Jeans`;
        description = `Stylish ${randomColor} denim jeans with a ${productNameBase.toLowerCase()} fit. Durable and fashionable.`;
      } else if (category.name === 'Dresses') {
        name = `${productNameBase} ${randomColor} Dress`;
        description = `An ${productNameBase.toLowerCase()} ${randomColor} dress, ideal for parties or casual outings.`;
      } else if (category.name === 'Kurtas') {
        name = `${productNameBase} ${randomColor} Kurta`;
        description = `Traditional ${randomColor} kurta with ${productNameBase.toLowerCase()} design. Perfect for festive occasions.`;
      } else if (category.name === 'Footwear') {
        name = `${productNameBase} ${randomColor} Shoes`;
        description = `High-quality ${productNameBase.toLowerCase()} ${randomColor} footwear for comfort and style.`;
      } else if (category.name === 'Watches') {
        name = `${productNameBase} ${randomColor} Watch`;
        description = `A sophisticated ${productNameBase.toLowerCase()} ${randomColor} watch with precision movement.`;
      } else { // Generic for top-level categories like Men, Women, Kids, Accessories
        name = `${productNameBase} ${category.name} Item ${productCounter}`;
        description = `A versatile ${productNameBase.toLowerCase()} item from our ${category.name} collection.`;
      }

      productsToInsert.push({
        name: name,
        description: description,
        price: price,
        stock_quantity: stock,
        category_id: category.id,
        image_url: `https://placehold.co/600x400/${Math.floor(Math.random()*16777215).toString(16)}/${Math.floor(Math.random()*16777215).toString(16)}?text=${encodeURIComponent(category.name)}+${productCounter}`,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      });
    }
  }

  await knex('products').insert(productsToInsert);

  console.log(`Seeded ${productsToInsert.length} products successfully!`);
};