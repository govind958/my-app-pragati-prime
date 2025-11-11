"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import RichTextEditor from "@/components/RichTextEditor"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button1"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/components/ImageUploader" 
import Link from "next/link"

export default function NewArticlePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState({
    title: "",
    content: "",
    is_paid: false,
    image_url: "",
    published: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setArticle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = (url) => {
    setArticle(prev => ({
      ...prev,
      image_url: url
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in to create an article.")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("articles").insert([
      {
        ...article,
        author_id: user.id,
        published_at: article.published ? new Date().toISOString() : null,
      },
    ])

    setLoading(false)

    if (error) {
      alert(`Error creating article: ${error.message}`)
    } else {
      alert("Article created successfully!")
      router.push("/admin") // Go back to the main admin panel
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">Create New Article</CardTitle>
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
                  value={article.title}
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
                    value={article.content}
                    onChange={handleChange}
                    id="content"
                  />
                </div>
              </div>
              
              {/* Cover Image */}
              <div>
                <ImageUploader onUpload={handleImageUpload} />
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
                      Creating...
                    </span>
                  ) : (
                    "Create Article"
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
