import { Router } from 'express';
import { query } from '../db';

const router = Router();

// GET /api/categories
router.get('/', async (_req, res): Promise<void> => {
  try {
    const result = await query(`
      SELECT 
        c.id,
        c.code,
        c.name,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as "productCount",
        c.created_at as "createdAt",
        c.updated_at as "updatedAt"
      FROM categories c
      ORDER BY c.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/categories/:code
router.get('/:code', async (req, res): Promise<void> => {
  try {
    const { code } = req.params;
    const result = await query(`
      SELECT 
        c.id,
        c.code,
        c.name,
        c.created_at as "createdAt",
        c.updated_at as "updatedAt"
      FROM categories c
      WHERE c.code = $1
    `, [code]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/categories
router.post('/', async (req, res): Promise<void> => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      res.status(400).json({ error: 'Código y nombre son obligatorios' });
      return;
    }

    const result = await query(`
      INSERT INTO categories (code, name)
      VALUES ($1, $2)
      RETURNING id, code, name
    `, [code, name]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/categories/:code
router.put('/:code', async (req, res): Promise<void> => {
  try {
    const { code } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'El nombre es obligatorio' });
      return;
    }

    const result = await query(`
      UPDATE categories 
      SET name = $1, updated_at = CURRENT_TIMESTAMP
      WHERE code = $2
      RETURNING id, code, name
    `, [name, code]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/categories/:code
router.delete('/:code', async (req, res): Promise<void> => {
  try {
    const { code } = req.params;

    // Verificar si tiene productos
    const prodResult = await query(
      'SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id WHERE c.code = $1',
      [code]
    );

    if (parseInt(prodResult.rows[0].count) > 0) {
      res.status(400).json({ error: 'No se puede eliminar una categoría con productos asociados' });
      return;
    }

    const result = await query('DELETE FROM categories WHERE code = $1 RETURNING code', [code]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    res.json({ message: 'Categoría eliminada correctamente', code: result.rows[0].code });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
