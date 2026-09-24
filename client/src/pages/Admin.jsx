import { useEffect, useState } from "react"

function Admin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function getItems() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/items")

        if (!response.ok) {
          throw new Error("Failed to load reports")
        }

        const data = await response.json()
        setItems(data)
      } catch {
        setError("Unable to load reports.")
      }

      setLoading(false)
    }

    getItems()
  }, [])

  async function updateApproval(id, approvalStatus) {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus })
      })

      if (!response.ok) {
        throw new Error("Unable to update the report")
      }

      const updatedItem = await response.json()

      setItems((currentItems) => currentItems.map((item) => {
        if (item._id === id) {
          return updatedItem
        }

        return item
      }))
    } catch {
      alert("Unable to update the report.")
    }
  }

  async function removeItem(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, { method: "DELETE" })

      if (!response.ok) {
        throw new Error("Unable to remove the report")
      }

      setItems((currentItems) => currentItems.filter((item) => item._id !== id))
    } catch {
      alert("Unable to remove the report.")
    }
  }

  let lost = 0
  let found = 0
  let claimed = 0
  const activeReports = []
  const claimedReports = []

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]

    if (item.status === "Lost") {
      lost += 1
    } else if (item.status === "Found") {
      found += 1
    } else if (item.status === "Claimed") {
      claimed += 1
      claimedReports.push(item)
    }

    if (item.status !== "Claimed") {
      activeReports.push(item)
    }
  }

  if (loading) {
    return <p>Loading reports...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Manage Lost & Found reports here.</p>

      <div className="admin-stats">
        <div className="admin-stat">
          <h2>{items.length}</h2>
          <p>Total Items</p>
        </div>
        <div className="admin-stat">
          <h2>{lost}</h2>
          <p>Lost</p>
        </div>
        <div className="admin-stat">
          <h2>{found}</h2>
          <p>Found</p>
        </div>
        <div className="admin-stat">
          <h2>{claimed}</h2>
          <p>Claimed</p>
        </div>
      </div>

      <h2>All Reports</h2>

      {activeReports.length === 0 ? (
        <p>No active reports.</p>
      ) : (
        activeReports.map((item) => (
          <div key={item._id} className="admin-report">
            <h3>{item.name}</h3>
            <p>Type: {item.status}</p>
            <p>Category: {item.category}</p>
            <p>Location: {item.location}</p>
            <p>Date: {item.date}</p>
            <p>Approval: {item.approvalStatus || "Pending"}</p>

            {item.approvalStatus === "Pending" && (
              <>
                <button onClick={() => updateApproval(item._id, "Approved")}>Approve</button>
                <button onClick={() => updateApproval(item._id, "Rejected")}>Reject</button>
              </>
            )}

            <button onClick={() => removeItem(item._id)}>Remove</button>
          </div>
        ))
      )}

      <h2>Claimed / Closed Items</h2>

      {claimedReports.length === 0 ? (
        <p>No claimed or closed items.</p>
      ) : (
        claimedReports.map((item) => (
          <div key={item._id} className="admin-report">
            <h3>{item.name}</h3>
            <p>Category: {item.category}</p>
            <p>Location: {item.location}</p>
            <p>Date: {item.date}</p>
            <p>Status: Claimed</p>
            <button onClick={() => removeItem(item._id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  )
}

export default Admin
