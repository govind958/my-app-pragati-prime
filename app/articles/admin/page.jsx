"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { getArticles, saveArticle, deleteArticle } from "@/lib/articles";

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    image: "",
    author: "Pragati Prime Team",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    const loadedArticles = getArticles();
    setArticles(loadedArticles);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const article = { ...formData };
    if (editingArticle) {
      article.id = editingArticle.id;
      article.slug = editingArticle.slug;
      article.date = editingArticle.date;
    }
    saveArticle(article);
    loadArticles();
    resetForm();
    alert(editingArticle ? "Article updated successfully!" : "Article created successfully!");
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      description: article.description,
      content: article.content,
      category: article.category || "",
      image: article.image || "",
      author: article.author || "Pragati Prime Team",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      deleteArticle(id);
      loadArticles();
      alert("Article deleted successfully!");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "",
      image: "",
      author: "Pragati Prime Team",
    });
    setEditingArticle(null);
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner.png"
            alt="Admin Panel"
            fill
            sizes="100vw"
            className="object-cover opacity-40 dark:opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            <span className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">Article Management</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-800 dark:text-zinc-400">
            Create, edit, and manage articles and blog posts.
          </p>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          {/* Action Buttons */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                {isEditing ? "Edit Article" : "All Articles"}
              </span>
            </h2>
            <div className="flex gap-3">
              <Link href="/articles">
                <Button variant="outline" className="rounded-full">
                  View Articles
                </Button>
              </Link>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} className="rounded-full">
                  + New Article
                </Button>
              )}
              {showForm && (
                <Button onClick={resetForm} variant="outline" className="rounded-full">
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Article Form */}
          {showForm && (
            <Card className="mb-8 rounded-2xl">
              <CardHeader>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {isEditing ? "Edit Article" : "Create New Article"}
                </h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Education, Healthcare"
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="author" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="/image.png"
                      className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Content *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows="12"
                      placeholder="Write your article content here. Use # for headings, ## for subheadings, and - for bullet points."
                      className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="rounded-full">
                      {isEditing ? "Update Article" : "Create Article"}
                    </Button>
                    <Button type="button" onClick={resetForm} variant="outline" className="rounded-full">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Articles List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">No articles found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id} className="rounded-2xl">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                          {article.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                          <span>{article.category || "General"}</span>
                          <span>•</span>
                          <span>{new Date(article.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{article.author}</span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {article.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(article)}
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(article.id)}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                        <Link href={`/articles/${article.slug}`}>
                          <Button variant="ghost" size="sm" className="rounded-full">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

