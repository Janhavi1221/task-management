import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and role'
      });
    }

    // For students, find by name (simplified login)
    if (role === 'student') {
      const student = await User.findOne({ name, role: 'student' });
      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      const token = generateToken(student._id);
      
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          avatar: student.avatar
        }
      });
    }

    // For teachers, find by name (simplified - in production use email/password)
    if (role === 'teacher') {
      const teacher = await User.findOne({ role: 'teacher' });
      if (!teacher) {
        return res.status(401).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      const token = generateToken(teacher._id);
      
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          role: teacher.role,
          avatar: teacher.avatar
        }
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
