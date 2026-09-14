const Item = require("./models/Item")
const User = require("./models/User")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()


const app = express()
const bcrypt = require("bcryptjs")

app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error))



app.get("/api/items", async (req, res) => {
  const items = await Item.find({
    approvalStatus: "Approved",
    status: { $ne: "Claimed" }
  })
  res.json(items)
})

app.get("/api/my-items/:userId", async (req, res) => {
  const items = await Item.find({ userId: req.params.userId })
  res.json(items)
})

app.get("/api/items/:id", async (req, res) => {
  const item = await Item.findById(req.params.id)
  res.json(item)
})

app.get("/api/admin/items", async (req, res) => {
  const items = await Item.find()
  res.json(items)
})

app.put("/api/items/:id", async (req, res) => {
  const update = {}

  if (req.body.status) {
    update.status = req.body.status
  }

  if (req.body.approvalStatus) {
    update.approvalStatus = req.body.approvalStatus
  }

  const item = await Item.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true }
  )

  res.json(item)
})

app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id)
  res.json({ message: "Item removed" })
})

app.get("/api/items/:id/matches", async (req, res) => {
  const item = await Item.findById(req.params.id)

const otherItems = await Item.find({
  _id: { $ne: item._id },
  status: { $ne: item.status },
  approvalStatus: "Approved"
})

  const keywords = (item.name + " " + item.description)
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 2)

  const matches = otherItems
    .map((match) => {
      let score = 0

      if (match.category === item.category) {
        score += 2
      }

      if (
        match.location.toLowerCase().trim() ===
        item.location.toLowerCase().trim()
      ) {
        score += 2
      }

     const itemDate = new Date(item.date)
const matchDate = new Date(match.date)

const days = Math.abs(
  (matchDate - itemDate) / (1000 * 60 * 60 * 24)
)

if (
  (item.status === "Lost" && match.status === "Found" && matchDate < itemDate) ||
  (item.status === "Found" && match.status === "Lost" && matchDate > itemDate)
) {
  return null
}

if (days === 0) {
  score += 2
} else if (days <= 7) {
  score += 1
}

      const text = (match.name + " " + match.description).toLowerCase()

      if (keywords.some((word) => text.includes(word))) {
        score += 4
      }

      return { match, score }
    })
    .filter((item) => item && item.score >= 4)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.match)

  res.json(matches)
})

app.post("/api/items", async (req, res) => {
  const item = new Item(req.body)
  const savedItem = await item.save()
  res.json(savedItem)
})

app.get("/", (req, res) => {
  res.send("Lost & Found API is running")
})

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = new User({
    name,
    email,
    password: hashedPassword
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" })
  }

  res.json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  })
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})

