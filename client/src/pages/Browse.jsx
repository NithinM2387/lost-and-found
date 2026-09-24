import { useEffect, useState } from "react"
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
    async function getItems() {
      try {
        const response = await fetch("http://localhost:5000/api/items")

        if (!response.ok) {
          throw new Error("Failed to load items")
        }

        const data = await response.json()
        setItems(data)
      } catch {
        setError("Unable to load items.")
      }

      setLoading(false)
    }

    getItems()
  }, [])

  const filteredItems = []

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]
    const nameMatches = item.name.toLowerCase().includes(search.toLowerCase())
    const typeMatches = type === "All" || item.status === type
    const categoryMatches = category === "All" || item.category === category

    if (nameMatches && typeMatches && categoryMatches) {
      filteredItems.push(item)
    }
  }

  if (loading) {
    return <p>Loading items...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="browse-section">
      <h1>Browse Items</h1>
      <p>View all lost and found items here.</p>

      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <select value={type} onChange={(event) => setType(event.target.value)}>
        <option value="All">All</option>
        <option value="Lost">Lost</option>
        <option value="Found">Found</option>
      </select>

      <select value={category} onChange={(event) => setCategory(event.target.value)}>
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
