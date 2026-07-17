import { Router } from 'express';
import { query } from '../db';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son obligatorios' });
      return;
    }

    const result = await query(
      'SELECT id, nombre, email, role FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/users
router.get('/users', async (_req, res): Promise<void> => {
  try {
    const result = await query('SELECT id, nombre, email, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
