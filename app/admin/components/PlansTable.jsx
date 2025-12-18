"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import { Input } from "@/components/ui/input";

export default function PlansTable({ supabase }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("id, name, price, billing_cycle, created_at")
        .order("price", { ascending: true });

      if (error) {
        console.error("Error loading membership plans:", error.message);
        alert("Failed to load plans.");
      } else {
        setPlans(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePriceChange = (id, value) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, price: value === "" ? "" : Number(value) || 0 } : p
      )
    );
  };

  const savePlan = async (plan) => {
    setSavingId(plan.id);
    try {
      const { error } = await supabase
        .from("membership_plans")
        .update({ price: plan.price })
        .eq("id", plan.id);

      if (error) {
        console.error("Error updating plan:", error.message);
        alert("Failed to update plan price.");
      } else {
        alert("Plan updated successfully.");
        await loadPlans();
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Plans</CardTitle>
        <CardDescription>
          View and update membership plan prices. Changes apply immediately to new payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-transparent border-t-orange-500 mx-auto" />
              <p className="mt-3 text-sm text-gray-600">Loading plans...</p>
            </div>
          </div>
        ) : plans.length === 0 ? (
          <p className="text-sm text-gray-600">No membership plans found.</p>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 border rounded-lg p-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{plan.name}</p>
                  <p className="text-xs text-gray-500">
                    Billing: {plan.billing_cycle || "yearly"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">₹</span>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={plan.price}
                    onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                    className="w-28"
                  />
                  <Button
                    size="sm"
                    onClick={() => savePlan(plan)}
                    disabled={savingId === plan.id}
                    className="ml-1"
                  >
                    {savingId === plan.id ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


