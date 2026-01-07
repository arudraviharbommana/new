const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  file_path: { type: String },
  plagiarism_score: { type: Number, default: 0.0 },
  // AI/heuristic relatability metrics (not for inter-student plagiarism)
  relatability_score: { type: Number, default: 0.0 },
  references: [{ source: String, snippet: String, url: String, score: Number }],
  professor_mark: { type: Number },
  professor_comment: { type: String },
  final_mark: { type: Number },
  submitted_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
