import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ItemCard from "../components/ItemCard"


function Browse() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [type, setType] = useState("All")
  const [category, setCategory] = useState("All")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"))

  fetch("http://localhost:5000/api/items")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load items")
      }
      return response.json()
    })
    .then((data) => {
      setItems(data)
      setLoading(false)
    })
    .catch(() => {
      setError("Unable to load items.")
      setLoading(false)
    })
}, [])

if (loading) {
  return <p>Loading items...</p>
}

if (error) {
  return <p>{error}</p>
}

  const filteredItems = items.filter((item) =>
  item.status !== "Claimed" &&
  item.name.toLowerCase().includes(search.toLowerCase()) &&
  (type === "All" || item.status === type) &&
  (category === "All" || item.category === category)
)
  return (
    <div className="browse-section">
      <h1>Browse Items</h1>
      <p>View all lost and found items here.</p>

      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="All">All</option>
        <option value="Lost">Lost</option>
        <option value="Found">Found</option>
      </select>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Bags">Bags</option>
        <option value="Electronics">Electronics</option>
        <option value="Keys">Keys</option>
      </select>

      <div className="card-container">
        {filteredItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
    filteredItems.map((item) => (
      <ItemCard
        key={item._id}
        name={item.name}
        type={item.status}
        category={item.category}
        location={item.location}
        description={item.description}
        date={item.date}
        onClick={() => navigate(`/item/${item._id}`)}
      />
    ))
  )}
</div>
</div>
  )
}

export default Browse