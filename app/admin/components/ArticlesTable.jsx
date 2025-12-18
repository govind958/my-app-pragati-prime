"use client";

import { useCallback, useEffect } from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Badge } from "@/components/ui/badge";

export default function ArticlesTable({ articles = [], refresh, supabase }) {
  const openArticleEditor = useCallback((article) => {
    const url = article
      ? `/admin/articles/edit/${article.id}`
      : `/admin/articles/new`;
    window.location.href = url;
  }, []);

  useEffect(() => {
    const handler = () => openArticleEditor(null);
    window.addEventListener("admin:add-article", handler);
    return () => window.removeEventListener("admin:add-article", handler);
  }, [openArticleEditor]);

  async function publishToggle(a) {
    try {
      await supabase
        .from("articles")
        .update({ published: !a.published })
        .eq("id", a.id);
      refresh();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update article status.");
    }
  }

  async function deleteArticle(a) {
    if (!confirm(`Permanently delete article "${a.title || a.id}"?`)) return;

    try {
      await supabase.from("articles").delete().eq("id", a.id);
      refresh();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Check RLS policies.");
    }
  }

  return (
    <div>
      <CardTitle className="text-lg mb-4">
        Content Articles ({articles.length})
      </CardTitle>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="min-w-full text-xs md:text-sm table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                <th className="p-2 md:p-3 font-medium text-gray-600">Title</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden sm:table-cell">
                  Member Plan
                </th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden sm:table-cell">Paid</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Status</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">Created</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-medium text-indigo-700">
                    <div className="truncate max-w-[150px] md:max-w-none">{a.title || "Untitled"}</div>
                    <div className="text-gray-500 text-xs sm:hidden">
                      {a.is_paid ? "Paid" : "Free"}
                    </div>
                    {a.is_paid && (
                      <div className="text-xs text-orange-600 mt-1">
                        Plan: {a.required_plan_name || "Any paid member"}
                      </div>
                    )}
                  </td>
                  <td className="p-2 md:p-3 hidden sm:table-cell text-gray-700">
                    {!a.is_paid
                      ? "Free"
                      : a.required_plan_name || "Any paid member"}
                  </td>
                  <td className="p-2 md:p-3 hidden sm:table-cell">{a.is_paid ? "Yes" : "No"}</td>
                  <td className="p-2 md:p-3">
                    <Badge
                      variant={a.published ? "default" : "destructive"}
                    >
                      {a.published ? "Live" : "Draft"}
                    </Badge>
                  </td>
                  <td className="p-2 md:p-3 text-gray-500 hidden md:table-cell">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-3 text-right whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                      <Button
                        size="sm"
                        onClick={() => openArticleEditor(a)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={a.published ? "outline" : "default"}
                        onClick={() => publishToggle(a)}
                      >
                        {a.published ? "Unpub" : "Publish"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteArticle(a)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {articles.length === 0 && (
        <p className="text-center py-4 text-gray-500">No articles found.</p>
      )}
    </div>
  );
}
