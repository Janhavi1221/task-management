import User from '../models/User.js';
import Task from '../models/Task.js';
import mongoose from 'mongoose';

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();

    // Create teacher
    const teacher = await User.create({
      name: 'Teacher Admin',
      email: 'teacher@school.edu',
      password: 'teacher123',
      role: 'teacher'
    });

    // Create students
    const students = await User.insertMany([
      { name: 'Alice Johnson', email: 'alice@school.edu', role: 'student' },
      { name: 'Bob Martinez', email: 'bob@school.edu', role: 'student' },
      { name: 'Clara Lee', email: 'clara@school.edu', role: 'student' },
      { name: 'David Kim', email: 'david@school.edu', role: 'student' },
      { name: 'Emma Wilson', email: 'emma@school.edu', role: 'student' },
      { name: 'Frank Chen', email: 'frank@school.edu', role: 'student' }
    ]);

    // Create tasks
    const tasks = await Task.insertMany([
      {
        title: 'Build a Portfolio Website',
        description: 'Create a personal portfolio using HTML, CSS, and JavaScript with at least 3 project showcases.',
        assignedTo: [students[0]._id, students[1]._id, students[2]._id],
        dueDate: new Date('2026-03-25'),
        priority: 'High',
        status: 'In Progress',
        createdBy: teacher._id,
        comments: [{
          id: 'c1',
          userId: students[0]._id,
          userName: 'Alice Johnson',
          text: 'Started working on the layout!',
          createdAt: new Date('2026-03-15T10:00:00Z')
        }]
      },
      {
        title: 'React Todo App',
        description: 'Build a todo application using React with add, edit, delete, and filter functionality.',
        assignedTo: [students[0]._id, students[3]._id],
        dueDate: new Date('2026-03-28'),
        priority: 'Medium',
        status: 'Pending',
        createdBy: teacher._id
      },
      {
        title: 'Database Design Assignment',
        description: 'Design an ER diagram and normalize tables for a library management system.',
        assignedTo: [students[1]._id, students[4]._id, students[5]._id],
        dueDate: new Date('2026-03-20'),
        priority: 'High',
        status: 'Completed',
        createdBy: teacher._id,
        comments: [{
          id: 'c2',
          userId: students[1]._id,
          userName: 'Bob Martinez',
          text: 'Submitted the final version.',
          createdAt: new Date('2026-03-18T14:00:00Z')
        }]
      },
      {
        title: 'API Integration Project',
        description: 'Fetch data from a public API and display it in a styled card layout.',
        assignedTo: [students[2]._id, students[3]._id, students[4]._id],
        dueDate: new Date('2026-04-01'),
        priority: 'Low',
        status: 'Pending',
        createdBy: teacher._id
      },
      {
        title: 'CSS Animation Challenge',
        description: 'Create 5 different CSS animations including keyframes, transitions, and transforms.',
        assignedTo: [students[0]._id, students[5]._id],
        dueDate: new Date('2026-03-22'),
        priority: 'Medium',
        status: 'In Progress',
        createdBy: teacher._id,
        comments: [{
          id: 'c3',
          userId: students[5]._id,
          userName: 'Frank Chen',
          text: 'Completed 3 out of 5 animations.',
          createdAt: new Date('2026-03-16T11:00:00Z')
        }]
      },
      {
        title: 'JavaScript Quiz App',
        description: 'Build an interactive quiz application with timer, score tracking, and result display.',
        assignedTo: [students[1]._id, students[2]._id, students[3]._id, students[5]._id],
        dueDate: new Date('2026-04-05'),
        priority: 'High',
        status: 'Pending',
        createdBy: teacher._id
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created 1 teacher, ${students.length} students, and ${tasks.length} tasks`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

export default seedData;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('dotenv').then(() => {
    import('../config/database.js').then(() => {
      seedData();
    });
  });
}
