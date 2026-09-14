import Navbar from "./components/Navbar"
import "./App.css"
import Home from "./pages/Home"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Browse from "./pages/Browse"
import ReportLost from "./pages/ReportLost"
import ReportFound from "./pages/ReportFound"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import ItemDetails from "./pages/ItemDetails"
import Profile from "./pages/Profile"
import Admin from "./pages/Admin"

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user")

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report/lost"
          element={
            <ProtectedRoute>
              <ReportLost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report/found"
          element={
            <ProtectedRoute>
              <ReportFound />
            </ProtectedRoute>
          }
        />

        <Route
          path="/item/:id"
          element={
            <ProtectedRoute>
              <ItemDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App