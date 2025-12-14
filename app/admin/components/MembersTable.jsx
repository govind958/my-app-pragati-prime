"use client";

import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import RoleSelector from "./shared/RoleSelector";

export default function MembersTable({ members = [], refresh, supabase }) {

  async function deleteMember(member) {
    if (
      !confirm(
        `Permanently delete member ${member.email}? This action cannot be undone.`
      )
    )
      return;

    try {
      await supabase.from("profiles").delete().eq("id", member.id);
      refresh();
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member. Check RLS policies.");
    }
  }

  return (
    <div>
      <CardTitle className="text-lg mb-4">
        Site Members ({members.length})
      </CardTitle>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="min-w-full text-xs md:text-sm table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                <th className="p-2 md:p-3 font-medium text-gray-600">Email</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden sm:table-cell">Name</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Role</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">Joined</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3">
                    <div className="font-medium">{m.email}</div>
                    <div className="text-gray-500 text-xs sm:hidden">{m.name}</div>
                  </td>
                  <td className="p-2 md:p-3 hidden sm:table-cell">{m.name}</td>
                  <td className="p-2 md:p-3">
                    <RoleSelector member={m} supabase={supabase} refresh={refresh} />
                  </td>

                  {/* Joined */}
                  <td className="p-2 md:p-3 text-gray-500 hidden md:table-cell">
                    {m.created_at ? new Date(m.created_at).toLocaleDateString() : "-"}
                  </td>

                  {/* Actions */}
                  <td className="p-2 md:p-3 text-right whitespace-nowrap">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMember(m)}
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
      {members.length === 0 && (
        <p className="text-center py-4 text-gray-500">No members found.</p>
      )}
    </div>
  );
}
