"use client";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import StatCard from "./shared/StatCard";

export default function Dashboard({ stats, refresh }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
        />
        <StatCard
          title="Paid Members"
          value={stats.paidUsers.toLocaleString()}
        />
        <StatCard
          title="Articles Published"
          value={stats.articles.toLocaleString()}
        />
        <StatCard
          title="Total Revenue"
          value={`₹ ${stats.revenue.toLocaleString()}`}
        />
        <StatCard
          title="Contact Form Submissions"
          value={stats.contactForms.toLocaleString()}
        />
      </div>

      <Card className="mt-6 md:mt-8">
        <CardHeader>
          <CardTitle>Quick Actions & Status</CardTitle>
          <CardDescription>
            The metrics above are generated from the latest data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={refresh}
            className="w-full sm:w-auto"
          >
            Refresh Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
