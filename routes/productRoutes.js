import express from 'express';
import { CartItem } from '../models/index.js';
import { Product } from '../models/Products.js';
import { sequelize } from '../db.js';
import { Op, fn, col } from 'sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const search = req.query.search;

    let whereClause = {};

    if (search) {
      const searchLower = search.toLowerCase();

      whereClause = {
        [Op.or]: [
          sequelize.where(fn('lower', col('name')), {
            [Op.like]: `%${searchLower}%`
          }),
          sequelize.where(fn('lower', col('keywords')), {
            [Op.like]: `%${searchLower}%`
          })
        ]
      };
    }

    const products = await Product.findAll({ where: whereClause });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET /products/:id - Get product details by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Todo: add admin restriction
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    const newProduct = await Product.create({
      id: body.id,
      name: body.name,
      image: body.image,
      priceCents: body.priceCents,
      keywords: body.keywords,

      // Flatten nested rating if provided
      stars: body.rating ? body.rating.stars : null,
      ratingCount: body.rating ? body.rating.count : null
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /products/:id.
//Todo: add admin restriction
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const body = req.body;

    const updatedFields = {
      name: body.name,
      image: body.image,
      priceCents: body.priceCents,
      keywords: body.keywords,
      stars: body.rating ? body.rating.stars : body.stars ?? null,
      ratingCount: body.rating ? body.rating.count : body.ratingCount ?? null
    };

    await product.update(updatedFields);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE /products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // Delete related cart items first
    await CartItem.destroy({ where: { productId: req.params.id }, transaction: t });

    // Delete the product
    const deletedCount = await Product.destroy({ where: { id: req.params.id }, transaction: t });

    if (deletedCount === 0) {
      await t.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    await t.commit();
    res.status(204).send();
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
});

export default router;
