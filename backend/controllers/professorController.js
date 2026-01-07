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
    const report = await plagiarism.checkSubmissionById(submission_id);
    res.json({ submission_id, report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute plagiarism/relatability' });
  }
}

// Professors can submit direct marks and comments. If provided, professor_mark overrides automatic final mark.
async function markSubmission(req, res) {
  try {
    const { submission_id } = req.params;
    const { professor_mark, professor_comment } = req.body;
    const sub = await Submission.findById(submission_id);
    if (!sub) return res.status(404).json({ error: 'Submission not found' });

    if (typeof professor_mark === 'number') {
      sub.professor_mark = professor_mark;
      sub.final_mark = professor_mark;
    }
    if (typeof professor_comment === 'string') sub.professor_comment = professor_comment;

    await sub.save();
    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark submission' });
  }
}

module.exports = { createAssignment, getSubmissions, getPlagiarism, markSubmission };
