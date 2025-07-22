/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Clear existing variants first
  await knex('product_variants').del();

  const products = await knex('products').select('id', 'name');

  if (products.length === 0) {
    console.warn('⚠️ No products found. Please seed products first.');
    return;
  }

  const commonColors = ["Black", "White", "Blue", "Red", "Grey"];
  const commonSizes = ["S", "M", "L", "XL", "XXL"];
  const dressSizes = ["XS", "S", "M", "L", "XL"];
  const footwearSizes = ["US 7", "US 8", "US 9", "US 10"];

  const productVariantsToInsert = [];

  for (const product of products) {
    const name = product.name.toLowerCase();
    const variants = new Map();

    let combinations = [];

    if (name.includes('t-shirt') || name.includes('kurta') || name.includes('jeans')) {
      for (const color of commonColors) {
        for (const size of commonSizes) {
          combinations.push({ name: 'color', value: color });
          combinations.push({ name: 'size', value: size });
        }
      }
    } else if (name.includes('dress')) {
      for (const color of commonColors) {
        for (const size of dressSizes) {
          combinations.push({ name: 'color', value: color });
          combinations.push({ name: 'size', value: size });
        }
      }
    } else if (name.includes('shoe') || name.includes('footwear')) {
      for (const size of footwearSizes) {
        for (const color of ["Black", "Brown", "White"]) {
          combinations.push({ name: 'size', value: size });
          combinations.push({ name: 'color', value: color });
        }
      }
    } else if (name.includes('watch')) {
      for (const color of ["Silver", "Gold", "Black", "Leather"]) {
        combinations.push({ name: 'color', value: color });
        combinations.push({ name: 'material', value: color });
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const randomColor = commonColors[Math.floor(Math.random() * commonColors.length)];
        combinations.push({ name: 'color', value: randomColor });
      }
    }

    // De-duplicate by attribute_name + value
    for (const combo of combinations) {
      const key = `${combo.name}-${combo.value}`;
      if (!variants.has(key)) {
        variants.set(key, {
          product_id: product.id,
          attribute_name: combo.name,
          attribute_value: combo.value,
          additional_price: parseFloat((Math.random() * 5).toFixed(2)),
          stock_quantity: Math.floor(Math.random() * (100 - 5) + 5),
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
        });
      }
    }

    productVariantsToInsert.push(...variants.values());
  }

  await knex('product_variants').insert(productVariantsToInsert);

  console.log(`✅ Seeded ${productVariantsToInsert.length} product variants successfully!`);
};
