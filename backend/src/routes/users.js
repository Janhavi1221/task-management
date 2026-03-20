import express from 'express';
import { getStudents, getStudentById, createStudent, deleteStudent } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('teacher'));

router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.post('/students', createStudent);
router.delete('/students/:id', deleteStudent);

export default router;
