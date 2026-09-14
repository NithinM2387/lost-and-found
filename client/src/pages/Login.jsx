import { useState } from "react"

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)

       if (data.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(data.user))
        alert("Login successful")
        window.location.href = "/"
      } else {
          alert(data.message)
        }
      })
  }

  return (
    <div className="login-form">
      <h1>Login</h1>
      <p>Login to your account.</p>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login