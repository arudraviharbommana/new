const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');
const professorController = require('../controllers/professorController');
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Health
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyToken, authController.me);

// Student
router.get('/student/assignments', verifyToken, requireRole('student'), studentController.getAssignments);
router.post('/student/submit', verifyToken, requireRole('student'), upload.single('file'), studentController.submit);
router.get('/student/submissions', verifyToken, requireRole('student'), studentController.getSubmissions);

// Professor
router.post('/professor/assignment', verifyToken, requireRole('professor'), professorController.createAssignment);
router.get('/professor/submissions', verifyToken, requireRole('professor'), professorController.getSubmissions);
router.get('/professor/plagiarism/:submission_id', verifyToken, requireRole('professor'), professorController.getPlagiarism);
router.post('/professor/mark/:submission_id', verifyToken, requireRole('professor'), professorController.markSubmission);

// Admin
router.get('/admin/users', verifyToken, requireRole('admin'), adminController.listUsers);
router.delete('/admin/users/:id', verifyToken, requireRole('admin'), adminController.deleteUser);

module.exports = router;
