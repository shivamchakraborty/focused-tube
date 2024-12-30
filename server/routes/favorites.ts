import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { pool } from '../config/database';

const router = express.Router();

// Add favorite
router.post(
  '/add',
  authenticateToken,
  [body('creatorId').notEmpty()],
  async (req: any, res) => {
    try {
      const { creatorId } = req.body;
      const userId = req.user.userId;

      await pool.query(
        'INSERT INTO favorites (user_id, creator_id) VALUES ($1, $2) ON CONFLICT (user_id, creator_id) DO NOTHING',
        [userId, creatorId]
      );

      res.status(201).json({ message: 'Favorite added successfully' });
    } catch (error) {
      console.error('Add favorite error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Remove favorite
router.delete(
  '/remove/:creatorId',
  authenticateToken,
  async (req: any, res) => {
    try {
      const { creatorId } = req.params;
      const userId = req.user.userId;

      const result = await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND creator_id = $2',
        [userId, creatorId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Favorite not found' });
      }

      res.json({ message: 'Favorite removed successfully' });
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get user's favorites
router.get('/list', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;