import { Router } from 'express';
import { query, getClient } from '../db';

const router = Router();

// GET /api/products
router.get('/', async (_req, res): Promise<void> => {
  try {
    const result = await query(`
      SELECT 
        p.id,
        p.code,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.min_stock as "minStock",
        c.code as "categoryCode",
        c.name as "categoryName",
        p.status,
        p.created_at as "createdAt",
        p.updated_at as "updatedAt"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/products/import
router.post('/import', async (req, res): Promise<void> => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    res.status(400).json({ error: 'No se recibieron productos para importar' });
    return;
  }

  const client = await getClient();
  const created: string[] = [];
  const skipped: string[] = [];
  const errors: Array<{ code?: string; row: number; message: string }> = [];

  try {
    await client.query('BEGIN');

    for (let i = 0; i < products.length; i++) {
      const p = products[i] ?? {};
      const code = String(p.code ?? '').trim();
      const name = String(p.name ?? '').trim();
      const description = String(p.description ?? '').trim();
      const price = Number(p.price);
      const stock = Number(p.stock);
      const minStock = Number(p.minStock);
      const categoryCode = String(p.categoryCode ?? '').trim();
      const status = String(p.status ?? 'Activo').trim();

      const rowError = (message: string) =>
        errors.push({ code: code || undefined, row: i + 2, message });

      if (!code || !name || !categoryCode) {
        rowError('Código, nombre y categoría son obligatorios');
        continue;
      }

      if (!Number.isFinite(price) || price <= 0) {
        rowError('Precio inválido (debe ser un número mayor a 0)');
        continue;
      }

      if (!Number.isInteger(stock) || stock < 0) {
        rowError('Stock inválido (debe ser un entero mayor o igual a 0)');
        continue;
      }

      if (!Number.isInteger(minStock) || minStock < 0) {
        rowError('Stock mínimo inválido (debe ser un entero mayor o igual a 0)');
        continue;
      }

      const validStatus = status === 'Inactivo' ? 'Inactivo' : 'Activo';

      const catResult = await client.query('SELECT id FROM categories WHERE code = $1', [
        categoryCode,
      ]);
      if (catResult.rows.length === 0) {
        rowError(`Categoría '${categoryCode}' no existe`);
        continue;
      }

      const exists = await client.query('SELECT code FROM products WHERE code = $1', [code]);
      if (exists.rows.length > 0) {
        skipped.push(code);
        continue;
      }

      await client.query(
        `INSERT INTO products (code, name, description, price, stock, min_stock, category_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [code, name, description, price, stock, minStock, catResult.rows[0].id, validStatus]
      );
      created.push(code);
    }

    await client.query('COMMIT');
    res.json({
      created: created.length,
      createdCodes: created,
      skipped: skipped.length,
      skippedCodes: skipped,
      errors,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al importar productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// POST /api/products
router.post('/', async (req, res): Promise<void> => {
  try {
    const { code, name, description, price, stock, minStock, categoryCode, status } = req.body;

    if (!code || !name || !price || !categoryCode) {
      res.status(400).json({ error: 'Código, nombre, precio y categoría son obligatorios' });
      return;
    }

    // Obtener category_id desde categoryCode
    const catResult = await query('SELECT id FROM categories WHERE code = $1', [categoryCode]);
    if (catResult.rows.length === 0) {
      res.status(400).json({ error: 'Categoría no válida' });
      return;
    }
    const categoryId = catResult.rows[0].id;

    const result = await query(`
      INSERT INTO products (code, name, description, price, stock, min_stock, category_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, code, name, description, price, stock, min_stock as "minStock", status
    `, [code, name, description || '', price, stock || 0, minStock || 0, categoryId, status || 'Activo']);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/products/:code
router.put('/:code', async (req, res): Promise<void> => {
  try {
    const { code } = req.params;
    const { name, description, price, stock, minStock, categoryCode, status } = req.body;

    // Obtener category_id desde categoryCode
    let categoryId = null;
    if (categoryCode) {
      const catResult = await query('SELECT id FROM categories WHERE code = $1', [categoryCode]);
      if (catResult.rows.length > 0) {
        categoryId = catResult.rows[0].id;
      }
    }

    const result = await query(`
      UPDATE products 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          stock = COALESCE($4, stock),
          min_stock = COALESCE($5, min_stock),
          category_id = COALESCE($6, category_id),
          status = COALESCE($7, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE code = $8
      RETURNING id, code, name, description, price, stock, min_stock as "minStock", status
    `, [name, description, price, stock, minStock, categoryId, status, code]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/products/:code
router.delete('/:code', async (req, res): Promise<void> => {
  try {
    const { code } = req.params;

    // Verificar si tiene movimientos
    const movResult = await query(
      'SELECT COUNT(*) FROM movements m JOIN products p ON m.product_id = p.id WHERE p.code = $1',
      [code]
    );

    if (parseInt(movResult.rows[0].count) > 0) {
      res.status(400).json({ error: 'No se puede eliminar un producto con movimientos registrados' });
      return;
    }

    const result = await query('DELETE FROM products WHERE code = $1 RETURNING code', [code]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json({ message: 'Producto eliminado correctamente', code: result.rows[0].code });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PATCH /api/products/:code/toggle-status
router.patch('/:code/toggle-status', async (req, res): Promise<void> => {
  try {
    const { code } = req.params;

    const result = await query(`
      UPDATE products 
      SET status = CASE WHEN status = 'Activo' THEN 'Inactivo' ELSE 'Activo' END,
          updated_at = CURRENT_TIMESTAMP
      WHERE code = $1
      RETURNING id, code, name, status
    `, [code]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
