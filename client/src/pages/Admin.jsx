import { useState, useEffect } from "react"

function Admin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/items")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load reports")
        }
        return response.json()
      })
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Unable to load reports.")
        setLoading(false)
      })
  }, [])

  const lost = items.filter((item) => item.status === "Lost").length
  const found = items.filter((item) => item.status === "Found").length
  const claimed = items.filter((item) => item.status === "Claimed").length

  const updateApproval = (id, approvalStatus) => {
    fetch(`http://localhost:5000/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approvalStatus: approvalStatus
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setItems(
          items.map((item) =>
            item._id === id ? data : item
          )
        )
      })
  }

  const removeItem = (id) => {
    fetch(`http://localhost:5000/api/items/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setItems(items.filter((item) => item._id !== id))
      })
  }

  if (loading) {
    return <p>Loading reports...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  const activeReports = items.filter(
    (item) => item.status !== "Claimed"
  )

  const claimedReports = items.filter(
    (item) => item.status === "Claimed"
  )

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

            <p>
              Approval: {item.approvalStatus || "Pending"}
            </p>

            {item.approvalStatus === "Pending" && (
              <>
                <button
                  onClick={() =>
                    updateApproval(item._id, "Approved")
                  }
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateApproval(item._id, "Rejected")
                  }
                >
                  Reject
                </button>
              </>
            )}

            <button onClick={() => removeItem(item._id)}>
              Remove
            </button>
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

            <button onClick={() => removeItem(item._id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default Admin