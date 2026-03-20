import User from '../models/User.js';

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private (Teacher only)
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students.map(student => ({
        id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student by ID
// @route   GET /api/users/students/:id
// @access  Private (Teacher only)
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create student
// @route   POST /api/users/students
// @access  Private (Teacher only)
export const createStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const student = await User.create({
      name,
      email,
      role: 'student'
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/users/students/:id
// @access  Private (Teacher only)
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student has assigned tasks
    const Task = require('../models/Task.js').default;
    const assignedTasks = await Task.find({ assignedTo: student._id });
    
    if (assignedTasks.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete student with assigned tasks. Please reassign tasks first.'
      });
    }

    await User.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
