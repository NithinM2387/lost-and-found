import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

function ItemDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [matches, setMatches] = useState([])

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load item")
        }
        return response.json()
      })
      .then((data) => setItem(data))
      .catch((error) => console.log(error))
  }, [id])

  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}/matches`)
      .then((response) => response.json())
      .then((data) => setMatches(data))
  }, [id])

  const updateStatus = (status) => {
    fetch(`http://localhost:5000/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: status })
    })
      .then((response) => response.json())
      .then((data) => setItem(data))
  }

  if (!item) {
    return <p>Unable to load item.</p>
  }

  return (
    <div className="item-details">
      <h1>{item.name}</h1>

      <p>Type: {item.status}</p>
      <p>Category: {item.category}</p>
      <p>Description: {item.description}</p>
      <p>Date: {item.date}</p>
      <p>Location: {item.location}</p>

      {user && item.userId === user.id && item.status === "Lost" && (
        <button onClick={() => updateStatus("Found")}>
          Mark as Found
        </button>
      )}

      {user && item.userId === user.id && item.status === "Found" && (
        <button onClick={() => updateStatus("Claimed")}>
          Mark as Claimed
        </button>
      )}

      <h2>Possible Matches</h2>

      {matches.length === 0 ? (
        <p>No possible matches found.</p>
      ) : (
        matches.map((match) => (
          <div key={match._id}>
            <h3>{match.name}</h3>
            <p>Category: {match.category}</p>
            <p>Location: {match.location}</p>
            <p>Description: {match.description}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default ItemDetails