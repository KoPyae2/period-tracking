"use client"

import { BookOpen, Lightbulb, Pill, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HealthArticle {
  title: string
  description: string
  icon: React.ReactNode
  category: string
}

export default function InsightsPage() {
  const healthArticles: HealthArticle[] = [
    {
      title: "Understanding Your Cycle Phases",
      description: "Learn about the different phases of your menstrual cycle and what happens in your body.",
      icon: <Lightbulb className="w-8 h-8" />,
      category: "Education"
    },
    {
      title: "Tracking Fertility Signs",
      description: "How to identify your most fertile days through body signs and symptoms.",
      icon: <BookOpen className="w-8 h-8" />,
      category: "Fertility"
    },
    {
      title: "Managing Period Pain",
      description: "Natural remedies and tips for dealing with menstrual cramps and discomfort.",
      icon: <Pill className="w-8 h-8" />,
      category: "Health"
    },
    {
      title: "Cycle Health and Nutrition",
      description: "How your diet affects your menstrual health and recommendations for each phase.",
      icon: <FileText className="w-8 h-8" />,
      category: "Wellness"
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">Health Insights</h2>
      
      {/* Featured Article */}
      <Card className="mb-8 border-2 border-primary/20">
        <CardContent className="p-0">
          <div className="md:flex">
            <div className="w-full md:w-1/3 bg-primary/10 flex items-center justify-center p-6">
              <div className="rounded-full bg-background p-4">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div className="w-full md:w-2/3 p-6">
              <div className="text-sm text-primary font-semibold mb-2">FEATURED</div>
              <h2 className="text-2xl font-bold mb-2">Your Cycle and Your Health</h2>
              <p className="text-muted-foreground mb-4">
                Understanding your menstrual cycle is key to understanding your overall health. 
                Your cycle can give you insights into hormonal balance, fertility, and more.
              </p>
              <div className="bg-muted text-sm p-3 rounded-lg">
                Did you know? The length of your menstrual cycle can be affected by stress, diet, 
                exercise, and sleep quality.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Health Articles */}
      <h2 className="text-xl font-semibold mb-4">Health Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {healthArticles.map((article, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 bg-primary/10 p-2 rounded-lg">
                    {article.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription className="mt-1">{article.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  {article.category}
                </span>
                <span className="text-xs text-muted-foreground">5 min read</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Personalized Insights */}
      <h2 className="text-xl font-semibold mb-4">Personalized Insights</h2>
      <Card>
        <CardHeader>
          <CardTitle>Your Health Patterns</CardTitle>
          <CardDescription>Personalized insights based on your cycle data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 border-2 border-dashed rounded-lg border-muted">
            <p className="text-muted-foreground">
              Continue tracking your cycle to receive personalized health insights
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 