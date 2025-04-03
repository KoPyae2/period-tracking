"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SymptomForm } from "@/components/symptom-form"

export default function SymptomsPage() {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">Symptom Tracking</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Track Your Symptoms</CardTitle>
          <CardDescription>Record daily symptoms to identify patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <SymptomForm />
        </CardContent>
      </Card>
      
      {/* Symptom History and Patterns would go here */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Symptom History</CardTitle>
          <CardDescription>View patterns and trends in your symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">
            Track symptoms to see your patterns here
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 