"use client"
import { useState } from "react"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [adminStatus, setAdminStatus] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setAdminStatus(null)
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Use API route to check admin status instead of direct Firestore access
      const response = await fetch('/api/check-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.isAdmin) {
          setAdminStatus("You are an admin!")
        } else {
          setAdminStatus("You are NOT an admin.")
        }
      } else {
        setAdminStatus("Failed to check admin status.")
      }
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Checking..." : "Login & Check Admin Status"}
        </button>
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {adminStatus && <p className="text-green-600 mt-4 text-center">{adminStatus}</p>}
      </form>
    </div>
  )
}
