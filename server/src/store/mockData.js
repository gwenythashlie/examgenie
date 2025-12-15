let nextId = 1;

const reviewers = [];
const exams = [];
const attempts = [];

const genId = () => String(nextId++);

module.exports = {
  reviewers,
  exams,
  attempts,
  genId,
};
