import { useState } from "react"

function Login() {
  const [form, setForm] = useState({ email: "", password: "" })

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await response.json()

      if (data.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(data.user))
        alert("Login successful")
        window.location.href = "/"
      } else {
        alert(data.message)
      }
    } catch {
      alert("Unable to log in.")
    }
  }

  return (
    <div className="login-form">
      <h1>Login</h1>
      <p>Login to your account.</p>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
        <label>Password</label>
        <input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
