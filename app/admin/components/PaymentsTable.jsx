"use client";

import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Badge } from "@/components/ui/badge";

export default function PaymentsTable({ payments = [], refresh, supabase }) {
  async function deletePayment(p) {
    if (!confirm(`Permanently delete payment "${p.id}"?`)) return;
    try {
      await supabase.from("payments").delete().eq("id", p.id);
      refresh();
    }
    catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment. Check RLS policies.");
    }
  }

  return (
    <div>
      <CardTitle className="text-lg mb-4">
        Payment Transactions ({payments.length})
      </CardTitle>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="min-w-full text-xs md:text-sm table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-200">
                <th className="p-2 md:p-3 font-medium text-gray-600">Txn ID</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">User</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Amount</th>
                <th className="p-2 md:p-3 font-medium text-gray-600">Status</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                <th className="p-2 md:p-3 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const userName = p.profiles?.name || p.profiles?.email || "Unknown";
                const userEmail = p.profiles?.email || "";
                return (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-mono text-xs text-gray-600">
                    <div>{p.id.substring(0, 8)}...</div>
                    <div className="text-gray-400 text-xs md:hidden mt-1">
                      {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-2 md:p-3">
                    <div className="font-medium">{userName}</div>
                    {userEmail && userName !== userEmail && (
                      <div className="text-xs text-gray-500">{userEmail}</div>
                    )}
                  </td>
                  <td className="p-2 md:p-3 font-semibold">
                    ₹ {p.amount ? p.amount.toLocaleString() : "0"}
                  </td>
                  <td className="p-2 md:p-3">
                    <Badge
                      variant={
                        p.status === "succeeded" 
                          ? "default" 
                          : p.status === "pending" 
                          ? "secondary" 
                          : "destructive"
                      }
                    >
                      {p.status || "unknown"}
                    </Badge>
                  </td>
                  <td className="p-2 md:p-3 text-gray-500 hidden md:table-cell">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 md:p-3 text-right whitespace-nowrap">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePayment(p)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {payments.length === 0 && (
        <p className="text-center py-4 text-gray-500">No payments found.</p>
      )}
    </div>
  );
}
