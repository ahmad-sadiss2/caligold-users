"use client"

import { useState } from "react"
import { api } from "@/lib/api"

export default function ApiTest() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    try {
      console.log("🧪 Testing API connection...")
      const reviews = await api.getCustomerReviews()
      console.log("✅ API Test Success:", reviews)
      setResult(JSON.stringify(reviews, null, 2))
    } catch (error) {
      console.error("❌ API Test Failed:", error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border border-red-500 bg-red-50">
      <h3 className="text-lg font-bold mb-2">API Test Component</h3>
      <button 
        onClick={testApi} 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Testing..." : "Test API Connection"}
      </button>
      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-96">
        {result || "Click button to test API"}
      </pre>
    </div>
  )
} 