// seeds/YYYYMMDDHHMMSS_seed_product_variants.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries in the product_variants table before seeding
  await knex('product_variants').del();

  // Get all product IDs and their names
  const products = await knex('products').select('id', 'name');

  if (products.length === 0) {
    console.warn('No products found. Please run the products seeder first.');
    return;
  }

  const productVariantsToInsert = [];
  const commonColors = ["Black", "White", "Blue", "Red", "Grey"];
  const commonSizes = ["S", "M", "L", "XL", "XXL"];
  const dressSizes = ["XS", "S", "M", "L", "XL"];
  const footwearSizes = ["US 7", "US 8", "US 9", "US 10"];

  for (const product of products) {
    const productName = product.name.toLowerCase();
    let variantCombinations = [];

    // Define variant logic based on inferred product type from name
    if (productName.includes('t-shirt') || productName.includes('kurta') || productName.includes('jeans')) {
      // For apparel, usually color and size variants
      for (const color of commonColors) {
        for (const size of commonSizes) {
          variantCombinations.push({ attribute_name: 'color', attribute_value: color, size: size });
          variantCombinations.push({ attribute_name: 'size', attribute_value: size, color: color }); // For simplicity, treating as separate, though real system would combine
        }
      }
    } else if (productName.includes('dress')) {
      // Dresses often have specific size ranges
      for (const color of commonColors) {
        for (const size of dressSizes) {
          variantCombinations.push({ attribute_name: 'color', attribute_value: color, size: size });
          variantCombinations.push({ attribute_name: 'size', attribute_value: size, color: color });
        }
      }
    } else if (productName.includes('shoe') || productName.includes('footwear')) {
      // Footwear usually has size and limited colors
      for (const size of footwearSizes) {
        for (const color of ["Black", "Brown", "White"]) {
             variantCombinations.push({ attribute_name: 'size', attribute_value: size, color: color });
             variantCombinations.push({ attribute_name: 'color', attribute_value: color, size: size });
        }
      }
    } else if (productName.includes('watch')) {
        // Watches might have color (strap color) or material variants
        for (const color of ["Silver", "Gold", "Black", "Leather"]) {
            variantCombinations.push({ attribute_name: 'color', attribute_value: color });
            variantCombinations.push({ attribute_name: 'material', attribute_value: color });
        }
    } else {
      // Generic variants for other products
      for (let i = 0; i < 3; i++) { // Just 3 generic color variants
        const randomColor = commonColors[Math.floor(Math.random() * commonColors.length)];
        variantCombinations.push({ attribute_name: 'color', attribute_value: randomColor });
      }
    }

    // Process unique combinations to avoid too many duplicate variant records
    const uniqueVariants = new Map(); // Using Map to store unique (attribute_name, attribute_value) pairs

    for (const vc of variantCombinations) {
        const key = `${vc.attribute_name}-${vc.attribute_value}`;
        if (!uniqueVariants.has(key)) {
            uniqueVariants.set(key, {
                product_id: product.id,
                attribute_name: vc.attribute_name,
                attribute_value: vc.attribute_value,
                additional_price: (Math.random() * 5).toFixed(2), // Small random additional price
                stock_quantity: Math.floor(Math.random() * (100 - 5) + 5), // Stock between 5 and 100
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            });
        }
    }
    productVariantsToInsert.push(...Array.from(uniqueVariants.values()));
  }

  await knex('product_variants').insert(productVariantsToInsert);

  console.log(`Seeded ${productVariantsToInsert.length} product variants successfully!`);
};