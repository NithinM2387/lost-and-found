import { useState } from "react"

function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        throw new Error("Unable to create account")
      }

      alert("Account created successfully!")
    } catch {
      alert("Unable to create account.")
    }
  }

  return (
    <div className="signup-form">
      <h1>Sign Up</h1>
      <p>Create a new account.</p>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" type="text" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
        <label>Password</label>
        <input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
        <button type="submit">Create Account</button>
      </form>
    </div>
  )
}

export default SignUp
