// Add this function to userController.js

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
