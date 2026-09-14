import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ItemCard from "../components/ItemCard"
import { Link } from "react-router-dom"

function Home() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"))

  fetch("http://localhost:5000/api/items")
    .then((response) => response.json())
    .then((data) => setItems(data))
}, [])

  return (
    <main className="home">

      <section className="hero">
        <h1>Lost Somthing?</h1>
        <h1>Found Somthing?</h1>

        <p>A simple platform to help people find their lost belongings.</p>

        <div className="hero-buttons">
          <Link to="/report/lost">Report Lost Item</Link>
          <Link to="/report/found">Report Found Item</Link>
        </div>
      </section>

      <section className="browse-section">
        <h2>Find Lost & Found Items</h2>

        <p>Search through reported lost and found items.</p>

        <Link to="/browse">Browse Items</Link>

        <div className="card-container">
          {items.filter((item) => item.status !== "Claimed").slice(0, 3).map((item) => (
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
          ))}
        </div>

      </section>

    </main>
  )
}

export default Home