"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter ,useParams} from "next/navigation"
import { createClient } from "@/utils/supabase/client"

// Initialize Supabase Client OUTSIDE the component
const supabase = createClient()

export default function EditArticlePage( ) {
    const params = useParams()
    console.log("params", params)
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true) // Set initial loading to true
  const [article, setArticle] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setArticle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // --- THIS IS THE FIX ---
  // We move the fetching logic inside the useEffect hook.
  // This avoids the infinite loop problem with useCallback.
  useEffect(() => {
    // Define the async function *inside* the effect
    const fetchArticleById = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single()
      
      if (error) {
        alert(`Error fetching article: ${error.message}`)
        router.push("/admin")
      } else {
        setArticle(data)
      }
      setLoading(false)
    }

    // --- THIS IS THE FIX ---
    // Only call the function if the 'id' from params is available
    if (id) {
      fetchArticleById()
    }
    // --- END OF FIX ---

  }, [id, router]) // The effect now only depends on stable 'id' and 'router'
  // --- END OF FIX ---


  // 2. Handle the form submission (UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { title, content, is_paid, published } = article

    const { error } = await supabase
      .from("articles")
      .update({
        title,
        content,
        is_paid,
        published,
        // Set/clear published_at timestamp
        published_at: published && !article.published_at 
          ? new Date().toISOString() 
          : !published 
          ? null 
          : article.published_at,
      })
      .eq("id", id)

    setLoading(false)

    if (error) {
      alert(`Error updating article: ${error.message}`)
    } else {
      alert("Article updated successfully!")
      router.push("/admin") // Go back to the main admin panel
    }
  }

  // Show a loading state while fetching data
  if (loading || !article) { // Show loading if loading OR article is still null
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Article Editor...</p>
        </div>
      </div>
    )
  }

  // Once data is loaded, show the form
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
          <a
            href="/admin"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition font-medium"
          >
            ← Back to Admin
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={article.title || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content (Markdown supported)
            </label>
            <textarea
              name="content"
              id="content"
              rows={15}
              value={article.content || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
            />
          </div>

          {/* Toggles: is_paid and published */}
          <div className="grid grid-cols-2 gap-6">
            <label htmlFor="is_paid" className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="is_paid"
                id="is_paid"
                checked={article.is_paid}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-800">Paid Content</span>
                <p className="text-sm text-gray-500">Is this a premium, members-only article?</p>
              </div>
            </label>

            <label htmlFor="published" className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={article.published}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-800">Publish</span>
                <p className="text-sm text-gray-500">Make this article visible to the public?</p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-right pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



