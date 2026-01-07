const Assignment = require('../models/assignment');
const Submission = require('../models/submission');
const plagiarism = require('../services/plagiarism');

async function createAssignment(req, res) {
  try {
    const { title, description, deadline } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });
    const a = new Assignment({ title, description, deadline: deadline ? new Date(deadline) : null, created_by: req.user._id });
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
}

async function getSubmissions(req, res) {
  try {
    // find assignments created by professor
    const assignments = await Assignment.find({ created_by: req.user._id });
    const ids = assignments.map(a => a._id);
    const subs = await Submission.find({ assignment_id: { $in: ids } }).populate('student_id assignment_id').sort({ submitted_at: -1 });
    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
}

async function getPlagiarism(req, res) {
  try {
    const { submission_id } = req.params;
    const score = await plagiarism.checkSubmissionById(submission_id);
    res.json({ submission_id, plagiarism_score: score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute plagiarism' });
  }
}

module.exports = { createAssignment, getSubmissions, getPlagiarism };
