"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter ,useParams} from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import RichTextEditor from "@/components/RichTextEditor"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button1"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Article Editor...</p>
        </div>
      </div>
    )
  }

  // Once data is loaded, show the form
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">Edit Article</CardTitle>
              <Button variant="outline" asChild>
                <Link href="/admin">← Back to Admin</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={article.title || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content</Label>
                <div className="mt-1">
                  <RichTextEditor
                    value={article.content || ""}
                    onChange={handleChange}
                    id="content"
                  />
                </div>
              </div>

              {/* Toggles: is_paid and published */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label htmlFor="is_paid" className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    name="is_paid"
                    id="is_paid"
                    checked={article.is_paid}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-primary rounded"
                  />
                  <div>
                    <span className="font-medium">Paid Content</span>
                    <p className="text-sm text-muted-foreground">Is this a premium, members-only article?</p>
                  </div>
                </label>

                <label htmlFor="published" className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    name="published"
                    id="published"
                    checked={article.published}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-primary rounded"
                  />
                  <div>
                    <span className="font-medium">Publish</span>
                    <p className="text-sm text-muted-foreground">Make this article visible to the public?</p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="text-right pt-4 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[140px]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



