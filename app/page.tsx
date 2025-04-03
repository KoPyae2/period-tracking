import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Track Your Cycle, Understand Your Body
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            A simple, private, and personalized period tracker that helps you predict your cycle, 
            track symptoms, and gain insights into your reproductive health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/app-dashboard">
                Open Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Period Tracking" 
              description="Easily log and predict your menstrual cycles with accurate insights." 
              icon="📅"
            />
            <FeatureCard 
              title="Fertility Window" 
              description="Know your most fertile days with personalized predictions." 
              icon="✨"
            />
            <FeatureCard 
              title="Symptom Logging" 
              description="Track physical and emotional symptoms throughout your cycle." 
              icon="📝"
            />
            <FeatureCard 
              title="Visual Calendar" 
              description="See your cycle data visualized in an intuitive calendar view." 
              icon="📊"
            />
            <FeatureCard 
              title="Cycle Insights" 
              description="Get personalized insights about your unique patterns." 
              icon="💡"
            />
            <FeatureCard 
              title="Private & Secure" 
              description="Your data stays private and secure with end-to-end encryption." 
              icon="🔒"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Period Tracker App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
