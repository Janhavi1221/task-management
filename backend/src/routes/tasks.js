import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(authorize('teacher'), createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('teacher'), deleteTask);

router.post('/:id/comments', addComment);

export default router;
