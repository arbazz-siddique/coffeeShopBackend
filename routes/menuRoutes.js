// routes/menuRoutes.js
import express from 'express';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/get', getMenuItems);
router.post('/add', isAuthenticated,addMenuItem);
router.put('/update/:id', isAuthenticated, updateMenuItem);
router.delete('/delete/:id', isAuthenticated, deleteMenuItem);

export default router;
