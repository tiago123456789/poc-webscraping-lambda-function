const mongoose = require("mongoose")

const Job = new mongoose.Schema({
  title: String,
  workMode: String,
  company: String,
  link: String,
  technologies: [String],
  postedAt: Date
});

module.exports = mongoose.model("job", Job)
