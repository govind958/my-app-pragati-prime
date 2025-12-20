"use client";

import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button1";

export default function ContactFormsTable({ forms = [], refresh, supabase }) {
  async function deleteForm(form) {
    if (
      !confirm(
        `Are you sure you want to delete the contact form submission from ${form.name}? This action cannot be undone.`
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("contact_us")
        .delete()
        .eq("id", form.id);

      if (error) {
        console.error("Error deleting form:", error);
        alert("Failed to delete form. Check RLS policies.");
        return;
      }

      alert("Form deleted successfully!");
      if (refresh) {
        refresh();
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Failed to delete form. Please try again.");
    }
  }
  return (
    <div>
      <CardTitle className="text-lg mb-4">
        Contact Form Submissions ({forms.length})
      </CardTitle>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="min-w-full text-xs md:text-sm table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                <th className="p-2 md:p-3 font-medium text-gray-600">Name</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Contact</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">
                  Location
                </th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">
                  State
                </th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Interested</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">
                  Status
                </th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">
                  Date
                </th>
                <th className="p-2 md:p-3 font-medium text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3">
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-gray-500 md:hidden mt-1">
                      {new Date(f.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-2 md:p-3">
                    <div className="text-sm text-gray-800">{f.email}</div>
                    {f.phone && (
                      <div className="text-xs text-gray-500">{f.phone}</div>
                    )}
                  </td>
                  <td className="p-2 md:p-3 hidden md:table-cell text-gray-700">
                    {f.location || "-"}
                  </td>
                  <td className="p-2 md:p-3 hidden md:table-cell text-gray-700">
                    {f.state || "-"}
                  </td>
                  <td className="p-2 md:p-3">
                    {f.interested_to_connect ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </td>
                  <td className="p-2 md:p-3 hidden md:table-cell">
                    <Badge
                      variant={
                        f.status === "new"
                          ? "secondary"
                          : f.status === "resolved"
                          ? "default"
                          : "outline"
                      }
                    >
                      {f.status || "new"}
                    </Badge>
                  </td>
                  <td className="p-2 md:p-3 hidden md:table-cell text-gray-500">
                    {new Date(f.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-3 text-right whitespace-nowrap">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteForm(f)}
                      className="text-xs sm:text-sm"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {forms.length === 0 && (
        <p className="text-center py-4 text-gray-500">
          No contact form submissions found.
        </p>
      )}
    </div>
  );
}


