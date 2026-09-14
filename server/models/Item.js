const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  date: String,
  location: String,
  image: String,
  status: String,
  approvalStatus: {
    type: String,
    default: "Pending"
  },
  userId: String
})

module.exports = mongoose.model("Item", itemSchema)