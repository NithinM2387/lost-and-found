import { useEffect, useState } from "react"

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user ? user.id : ""
  const [items, setItems] = useState([])

  useEffect(() => {
    async function getItems() {
      try {
        const response = await fetch(`http://localhost:5000/api/my-items/${userId}`)
        const data = await response.json()
        setItems(data)
      } catch {
        setItems([])
      }
    }

    if (userId) {
      getItems()
    }
  }, [userId])

  if (!user) {
    return <p>Please login first.</p>
  }

  return (
    <div className="item-details">
      <h1>My Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <h2>My Reports</h2>

      {items.length === 0 ? (
        <p>You have not reported any items.</p>
      ) : (
        items.map((item) => (
          <div key={item._id}>
            <h3>{item.name}</h3>
            <p>Type: {item.status}</p>
            <p>Category: {item.category}</p>
            <p>Location: {item.location}</p>
            <p>Date: {item.date}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default Profile
