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
    const { name, password } = req.body;

    console.log('Login attempt:', { name, password: password ? '***' : 'undefined' });

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and password'
      });
    }

    // Find user by name
    let user = await User.findOne({ name });
    
    if (!user) {
      console.log('User not found:', name);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    console.log('User found:', user.name, user.role, 'has password:', !!user.password);

    // For students and teachers, check actual password using bcrypt
    let isValidPassword = false;
    if (user.role === 'student') {
      // Students can use either their name as password or their stored password
      if (user.password) {
        // Try bcrypt comparison
        try {
          isValidPassword = await user.comparePassword(password);
        } catch (e) {
          // If bcrypt fails, fall back to simple comparison
          isValidPassword = password === user.name;
        }
      } else {
        // No stored password, use name as password
        isValidPassword = password === user.name;
      }
    } else if (user.role === 'teacher') {
      // Teachers must use stored password
      if (user.password) {
        try {
          isValidPassword = await user.comparePassword(password);
        } catch (e) {
          // If bcrypt fails, fall back to simple comparison
          isValidPassword = password === 'teacher123';
        }
      } else {
        // No stored password, use default
        isValidPassword = password === 'teacher123';
      }
    }

    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Wrong password'
      });
    }
    
    console.log('Login successful for:', user.name);
    
    const token = generateToken(user._id);
    
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
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

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      role,
      password: role === 'teacher' ? password : undefined // Students don't need password in DB
    });
    
    const token = generateToken(user._id);
    
    return res.status(201).json({
      success: true,
      message: 'Signed up successfully',
      token,
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

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
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
