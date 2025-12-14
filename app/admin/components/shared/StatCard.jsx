"use client";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function StatCard({ title, value }) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <CardDescription className="text-primary mb-2">{title}</CardDescription>
        <CardTitle className="text-3xl font-bold">{value}</CardTitle>
      </CardContent>
    </Card>
  );
}
