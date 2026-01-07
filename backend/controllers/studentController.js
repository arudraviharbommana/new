const Submission = require('../models/submission');
const Assignment = require('../models/assignment');
const plagiarism = require('../services/plagiarism');

async function getAssignments(req, res) {
  const assignments = await Assignment.find().sort({ created_at: -1 }).lean();
  res.json(assignments);
}

async function submit(req, res) {
  try {
    const { assignment_id, content } = req.body;
    if (!assignment_id) return res.status(400).json({ error: 'assignment_id required' });

    const filePath = req.file ? req.file.path : null;

    const sub = new Submission({ assignment_id, student_id: req.user._id, content: content || '', file_path: filePath });
    await sub.save();

    // run plagiarism check against other submissions
    const score = await plagiarism.checkSubmission(sub);
    sub.plagiarism_score = score;
    await sub.save();

    res.status(201).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit' });
  }
}

async function getSubmissions(req, res) {
  const subs = await Submission.find({ student_id: req.user._id }).populate('assignment_id').sort({ submitted_at: -1 });
  res.json(subs);
}

module.exports = { getAssignments, submit, getSubmissions };
