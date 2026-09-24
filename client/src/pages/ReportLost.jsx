import { useState } from "react"

function ReportLost() {
  const [form, setForm] = useState({
    name: "",
    category: "Bags",
    description: "",
    date: "",
    location: ""
  })

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const user = JSON.parse(localStorage.getItem("user"))

    try {
      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "Lost", userId: user.id })
      })

      if (!response.ok) {
        throw new Error("Unable to save item")
      }

      alert("Lost item reported successfully!")
    } catch {
      alert("Unable to report the lost item.")
    }
  }

  return (
    <div className="report-form">
      <h1>Report Lost Item</h1>
      <p>Report an item that you have lost</p>
      <form onSubmit={handleSubmit}>
        <label>Item Name</label>
        <input name="name" type="text" placeholder="Enter item name" value={form.name} onChange={handleChange} required />
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option>Bags</option>
          <option>Electronics</option>
          <option>Keys</option>
          <option>Other</option>
        </select>
        <label>Description</label>
        <textarea name="description" placeholder="Describe the item" value={form.description} onChange={handleChange} required />
        <label>Date Lost</label>
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <label>Location</label>
        <input name="location" type="text" placeholder="Where did you lose it?" value={form.location} onChange={handleChange} required />
        <label>Image (optional)</label>
        <input type="file" />
        <button type="submit">Report Lost Item</button>
      </form>
    </div>
  )
}

export default ReportLost
