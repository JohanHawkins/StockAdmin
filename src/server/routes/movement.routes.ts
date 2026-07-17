import { Router } from 'express';
import { query, getClient } from '../db';

const router = Router();

// GET /api/movements
router.get('/', async (_req, res) => {
  try {
    const result = await query(`
      SELECT 
        m.id,
        m.code,
        p.code as "productCode",
        p.name as "productName",
        m.type,
        m.quantity,
        m.observation,
        u.nombre as "userName",
        m.created_at as "date"
      FROM movements m
      LEFT JOIN products p ON m.product_id = p.id
      LEFT JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/movements/:code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const result = await query(`
      SELECT 
        m.id,
        m.code,
        p.code as "productCode",
        p.name as "productName",
        m.type,
        m.quantity,
        m.observation,
        u.nombre as "userName",
        m.created_at as "date"
      FROM movements m
      LEFT JOIN products p ON m.product_id = p.id
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.code = $1
    `, [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/movements
router.post('/', async (req, res) => {
  const client = await getClient();

  try {
    const { code, productCode, type, quantity, observation, userId } = req.body;

    if (!code || !productCode || !type || !quantity) {
      return res.status(400).json({ error: 'Código, producto, tipo y cantidad son obligatorios' });
    }

    await client.query('BEGIN');

    // Obtener product_id
    const prodResult = await client.query('SELECT id, stock FROM products WHERE code = $1', [productCode]);
    if (prodResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Producto no válido' });
    }

    const product = prodResult.rows[0];

    // Validar stock para salidas
    if (type === 'SALIDA' && quantity > product.stock) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No hay stock suficiente para realizar la salida' });
    }

    // Actualizar stock
    const newStock = type === 'ENTRADA' ? product.stock + quantity : product.stock - quantity;
    await client.query(
      'UPDATE products SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newStock, product.id]
    );

    // Crear movimiento
    const result = await client.query(`
      INSERT INTO movements (code, product_id, type, quantity, observation, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, code, type, quantity, observation, created_at as "date"
    `, [code, product.id, type, quantity, observation || '', userId || null]);

    await client.query('COMMIT');

    res.status(201).json({
      ...result.rows[0],
      productCode,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// GET /api/movements/generate-code
router.get('/generate-code', async (_req, res) => {
  try {
    const result = await query('SELECT code FROM movements ORDER BY id DESC LIMIT 1');

    if (result.rows.length === 0) {
      return res.json({ code: 'M001' });
    }

    const lastCode = result.rows[0].code;
    const lastNumber = parseInt(lastCode.replace('M', ''));
    const newCode = 'M' + (lastNumber + 1).toString().padStart(3, '0');

    res.json({ code: newCode });
  } catch (error) {
    console.error('Error al generar código:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
