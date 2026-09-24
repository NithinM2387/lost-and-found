const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Item = require("./models/Item")
const User = require("./models/User")

require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error))

// Get approved items that have not been claimed
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find({
      approvalStatus: "Approved",
      status: { $ne: "Claimed" }
    })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: "Unable to load items" })
  }
})

// Get reports created by one user
app.get("/api/my-items/:userId", async (req, res) => {
  try {
    const items = await Item.find({ userId: req.params.userId })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: "Unable to load user reports" })
  }
})

// Get one item
app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    res.json(item)
  } catch (error) {
    res.status(500).json({ message: "Unable to load item" })
  }
})

// Get every report for the admin page
app.get("/api/admin/items", async (req, res) => {
  try {
    const items = await Item.find()
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: "Unable to load reports" })
  }
})

// Update an item status or approval status
app.put("/api/items/:id", async (req, res) => {
  try {
    const update = {}

    if (req.body.status) {
      update.status = req.body.status
    }

    if (req.body.approvalStatus) {
      update.approvalStatus = req.body.approvalStatus
    }

    const item = await Item.findByIdAndUpdate(req.params.id, update, { new: true })

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    res.json(item)
  } catch (error) {
    res.status(500).json({ message: "Unable to update item" })
  }
})

// Remove an item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id)

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    res.json({ message: "Item removed" })
  } catch (error) {
    res.status(500).json({ message: "Unable to remove item" })
  }
})

// Find possible Lost and Found matches
app.get("/api/items/:id/matches", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    if (item.status !== "Lost" && item.status !== "Found") {
      return res.json([])
    }

    let otherStatus = "Found"

    if (item.status === "Found") {
      otherStatus = "Lost"
    }

    const otherItems = await Item.find({
      _id: { $ne: item._id },
      status: otherStatus,
      approvalStatus: "Approved"
    })

    const itemText = `${item.name} ${item.description}`.toLowerCase()
    const itemWords = itemText.split(" ")
    const keywords = []

    for (let index = 0; index < itemWords.length; index += 1) {
      if (itemWords[index].length > 2) {
        keywords.push(itemWords[index])
      }
    }

    const scoredMatches = []
    const itemDate = new Date(item.date)
    const itemLocation = item.location.toLowerCase().trim()

    for (let index = 0; index < otherItems.length; index += 1) {
      const possibleMatch = otherItems[index]
      const matchDate = new Date(possibleMatch.date)

      // A found report cannot be earlier than its lost report.
      if (item.status === "Lost" && matchDate < itemDate) {
        continue
      }

      if (item.status === "Found" && matchDate > itemDate) {
        continue
      }

      let score = 0

      if (possibleMatch.category === item.category) {
        score += 2
      }

      if (possibleMatch.location.toLowerCase().trim() === itemLocation) {
        score += 2
      }

      const daysApart = Math.abs(matchDate - itemDate) / (1000 * 60 * 60 * 24)

      if (daysApart === 0) {
        score += 2
      } else if (daysApart <= 7) {
        score += 1
      }

      const matchText = `${possibleMatch.name} ${possibleMatch.description}`.toLowerCase()
      let hasMatchingKeyword = false

      for (let wordIndex = 0; wordIndex < keywords.length; wordIndex += 1) {
        if (matchText.includes(keywords[wordIndex])) {
          hasMatchingKeyword = true
          break
        }
      }

      if (hasMatchingKeyword) {
        score += 4
      }

      if (score >= 4) {
        scoredMatches.push({ item: possibleMatch, score })
      }
    }

    scoredMatches.sort((firstMatch, secondMatch) => secondMatch.score - firstMatch.score)

    const matches = []

    for (let index = 0; index < scoredMatches.length; index += 1) {
      matches.push(scoredMatches[index].item)
    }

    res.json(matches)
  } catch (error) {
    res.status(500).json({ message: "Unable to find matches" })
  }
})

// Create a lost or found report
app.post("/api/items", async (req, res) => {
  try {
    const item = new Item(req.body)
    const savedItem = await item.save()
    res.json(savedItem)
  } catch (error) {
    res.status(500).json({ message: "Unable to save item" })
  }
})

// Create a user account
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword })
    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    res.status(500).json({ message: "Unable to create account" })
  }
})

// Log a user in
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid password" })
    }

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: "Unable to log in" })
  }
})

app.get("/", (req, res) => {
  res.send("Lost & Found API is running")
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})
