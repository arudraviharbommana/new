const Submission = require('../models/submission');

// Simple TF-IDF + cosine similarity implementation
function tokenize(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function tf(tokens) {
  const freqs = {};
  tokens.forEach(t => freqs[t] = (freqs[t] || 0) + 1);
  const len = tokens.length || 1;
  Object.keys(freqs).forEach(k => freqs[k] = freqs[k] / len);
  return freqs;
}

function idf(docs) {
  const N = docs.length;
  const df = {};
  docs.forEach(tokens => {
    const seen = new Set(tokens);
    seen.forEach(t => df[t] = (df[t] || 0) + 1);
  });
  const idfMap = {};
  Object.keys(df).forEach(k => idfMap[k] = Math.log(N / (df[k] || 1)));
  return idfMap;
}

function dot(a, b) {
  let s = 0;
  Object.keys(a).forEach(k => { if (b[k]) s += a[k] * b[k]; });
  return s;
}

function norm(a) { return Math.sqrt(Object.values(a).reduce((sum, v) => sum + v * v, 0)); }

async function checkSubmission(submission) {
  // fetch other submissions for same assignment
  const others = await Submission.find({ assignment_id: submission.assignment_id, _id: { $ne: submission._id } });
  const docs = [submission, ...others];
  const tokensArr = docs.map(d => tokenize(d.content || ''));

  if (tokensArr.length <= 1) return 0.0;

  const idfMap = idf(tokensArr);
  const tfs = tokensArr.map(tf);
  const tfsIdf = tfs.map(tmap => {
    const out = {};
    Object.keys(tmap).forEach(k => out[k] = tmap[k] * (idfMap[k] || 0));
    return out;
  });

  const target = tfsIdf[0];
  let maxScore = 0;
  for (let i = 1; i < tfsIdf.length; i++) {
    const other = tfsIdf[i];
    const numerator = dot(target, other);
    const denom = norm(target) * norm(other);
    const sim = denom === 0 ? 0 : numerator / denom;
    if (sim > maxScore) maxScore = sim;
  }

  // return percentage
  return Math.round(maxScore * 10000) / 100; // two decimal percentage
}

async function checkSubmissionById(submission_id) {
  const submission = await Submission.findById(submission_id);
  if (!submission) throw new Error('Submission not found');
  const score = await checkSubmission(submission);
  submission.plagiarism_score = score;
  await submission.save();
  return score;
}

module.exports = { checkSubmission, checkSubmissionById };
