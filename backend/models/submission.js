const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  file_path: { type: String },
  plagiarism_score: { type: Number, default: 0.0 },
  submitted_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
