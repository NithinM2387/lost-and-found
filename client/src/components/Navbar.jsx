import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )

  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span>🔎</span> Lost & Found
      </Link>

      <div>
        {user ? (
          <>
            <Link to="/browse" className="nav-link">Browse</Link>
            <Link to="/report/lost" className="nav-link">Report Lost</Link>
            <Link to="/report/found" className="nav-link">Report Found</Link>
            <Link to="/profile" className="nav-link">Profile</Link>

            <button
              onClick={() => {
                localStorage.removeItem("user")
                setUser(null)
                navigate("/login")
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar