const Submission = require('../models/submission');
const Assignment = require('../models/assignment');

// Tokenization utilities
function tokenize(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9_\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function tf(tokens) {
  const freqs = {};
  tokens.forEach(t => freqs[t] = (freqs[t] || 0) + 1);
  const len = tokens.length || 1;
  Object.keys(freqs).forEach(k => freqs[k] = freqs[k] / len);
  return freqs;
}

function idf(docs) {
  const N = docs.length || 1;
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

// Heuristic extractors
function extractVariables(text) {
  const vars = new Set();
  if (!text) return vars;
  // simple patterns: JS/Python variable assignments and function params
  const varAssign = /(?:var|let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
  const pyAssign = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*/g;
  const funcParams = /function\s+[a-zA-Z0-9_]*\s*\(([^)]*)\)|def\s+[a-zA-Z0-9_]*\s*\(([^)]*)\)/g;
  let m;
  while ((m = varAssign.exec(text)) !== null) vars.add(m[1]);
  while ((m = pyAssign.exec(text)) !== null) vars.add(m[1]);
  while ((m = funcParams.exec(text)) !== null) {
    const params = (m[1] || m[2] || '').split(',').map(p => p.trim().split(/[:=\s]/)[0]).filter(Boolean);
    params.forEach(p => vars.add(p));
  }
  return vars;
}

function extractComments(text) {
  const comments = [];
  if (!text) return comments;
  // JS-style
  const jsLine = /\/\/([^\n]*)/g;
  const jsBlock = /\/\*([\s\S]*?)\*\//g;
  const pyLine = /#([^\n]*)/g;
  let m;
  while ((m = jsLine.exec(text)) !== null) comments.push(m[1].trim());
  while ((m = jsBlock.exec(text)) !== null) comments.push(m[1].trim());
  while ((m = pyLine.exec(text)) !== null) comments.push(m[1].trim());
  return comments;
}

function jaccard(aSet, bSet) {
  const a = new Set(aSet);
  const b = new Set(bSet);
  if (a.size === 0 && b.size === 0) return 1.0;
  const inter = new Set([...a].filter(x => b.has(x))).size;
  const uni = new Set([...a, ...b]).size;
  return uni === 0 ? 0 : inter / uni;
}

// Placeholder for external reference matching (web/AI search). Returns empty array for now.
async function findExternalMatches(text) {
  // TODO: Integrate with external search or AI to find similar public sources, return { source, snippet, url, score }
  return [];
}

// Main analysis: compares submission to assignment description and returns detailed metrics
async function analyzeSubmission(submission) {
  const assignment = await Assignment.findById(submission.assignment_id);
  const desc = (assignment && assignment.description) ? assignment.description : '';

  const subTokens = tokenize(submission.content || '');
  const descTokens = tokenize(desc || '');

  // TF-IDF cosine similarity between submission and description
  const idfMap = idf([subTokens, descTokens]);
  const tfSub = tf(subTokens);
  const tfDesc = tf(descTokens);
  const tfidfSub = {}, tfidfDesc = {};
  Object.keys(tfSub).forEach(k => tfidfSub[k] = tfSub[k] * (idfMap[k] || 0));
  Object.keys(tfDesc).forEach(k => tfidfDesc[k] = tfDesc[k] * (idfMap[k] || 0));
  const numerator = dot(tfidfSub, tfidfDesc);
  const denom = norm(tfidfSub) * norm(tfidfDesc);
  const contentSim = denom === 0 ? 0 : numerator / denom; // 0..1

  // variable similarity
  const subVars = extractVariables(submission.content || '');
  const descVars = extractVariables(desc || '');
  const varSim = jaccard(subVars, descVars);

  // comment style similarity (cosine on concatenated comments)
  const subComments = extractComments(submission.content || '').join(' ');
  const descComments = extractComments(desc || '').join(' ');
  const commentTokensSub = tokenize(subComments);
  const commentTokensDesc = tokenize(descComments);
  const idfComments = idf([commentTokensSub, commentTokensDesc]);
  const tfCSub = tf(commentTokensSub);
  const tfCDesc = tf(commentTokensDesc);
  const tfidfCSub = {}, tfidfCDesc = {};
  Object.keys(tfCSub).forEach(k => tfidfCSub[k] = tfCSub[k] * (idfComments[k] || 0));
  Object.keys(tfCDesc).forEach(k => tfidfCDesc[k] = tfCDesc[k] * (idfComments[k] || 0));
  const numeratorC = dot(tfidfCSub, tfidfCDesc);
  const denomC = norm(tfidfCSub) * norm(tfidfCDesc);
  const commentSim = denomC === 0 ? 0 : numeratorC / denomC;

  // structure heuristics: number of functions, classes
  const funcCountSub = (submission.content || '').match(/function\s+|def\s+|=>\s*\{/g) || [];
  const funcCountDesc = (desc || '').match(/function\s+|def\s+|=>\s*\{/g) || [];
  const structSim = jaccard([funcCountSub.length], [funcCountDesc.length]);

  // external matches
  const references = await findExternalMatches(submission.content || '');
  const externalScore = references.length ? Math.max(...references.map(r => r.score || 0)) : 0;

  // weighted relatability score
  const weights = { content: 0.6, variables: 0.1, comments: 0.1, structure: 0.1, external: 0.1 };
  const relatability = (contentSim * weights.content) + (varSim * weights.variables) + (commentSim * weights.comments) + (structSim * weights.structure) + (externalScore * weights.external);

  const report = {
    contentSimilarity: Math.round(contentSim * 10000) / 100, // percentage 0..100 two decimals
    variableSimilarity: Math.round(varSim * 10000) / 100,
    commentSimilarity: Math.round(commentSim * 10000) / 100,
    structureScore: Math.round(structSim * 10000) / 100,
    externalMatches: references,
    relatability_score: Math.round(relatability * 10000) / 100 // 0..100
  };

  return report;
}

// Called by student submit: compute relatability, save into submission but return a numeric plagiarism score for backward compatibility (we do NOT compare students against other students)
async function checkSubmission(submission) {
  const report = await analyzeSubmission(submission);
  submission.relatability_score = report.relatability_score;
  submission.references = report.externalMatches;
  // keep a legacy plagiarism_score field but set to 0 (we intentionally do not flag inter-student plagiarism)
  submission.plagiarism_score = 0;
  await submission.save();
  return submission.plagiarism_score;
}

// For professor: return the full report object and store relatability
async function checkSubmissionById(submission_id) {
  const submission = await Submission.findById(submission_id);
  if (!submission) throw new Error('Submission not found');
  const report = await analyzeSubmission(submission);
  submission.relatability_score = report.relatability_score;
  submission.references = report.externalMatches;
  await submission.save();
  return report;
}

module.exports = { analyzeSubmission, checkSubmission, checkSubmissionById };
