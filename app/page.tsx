import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarDays, LineChart, ShieldCheck, Droplets, Heart, BrainCircuit } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">

      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6 max-w-3xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 text-transparent bg-clip-text">
                Track Your Cycle, Empower Your Life
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-[700px] mx-auto">
                An intelligent, private, and personalized period tracker that helps you predict cycles,
                track symptoms, and understand your body better than ever before.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25" asChild>
                <Link href="/app-dashboard">
                  Start Tracking Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-foreground/20 hover:bg-accent hover:text-accent-foreground" asChild>
                <Link href="#features">
                  Explore Features
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 h-full w-full opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute left-1/4 top-1/3 h-56 w-56 rounded-full bg-purple-300 mix-blend-multiply blur-3xl" />
          <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-rose-300 mix-blend-multiply blur-3xl" />
          <div className="absolute left-1/2 bottom-1/4 h-40 w-40 rounded-full bg-cyan-300 mix-blend-multiply blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-12 md:mb-16">
            <div className="inline-block rounded-lg bg-foreground/10 px-3 py-1 text-sm">
              Designed for You
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Comprehensive Cycle Management
            </h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px]">
              Our intelligent features work together to give you the most accurate and personalized experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              title="Smart Period Predictions"
              description="Advanced algorithms learn from your unique cycle patterns for better predictions each month."
              icon={<CalendarDays className="size-10 text-rose-500" />}
              gradient="from-rose-500/20 to-rose-500/5"
            />
            <FeatureCard
              title="Fertility Awareness"
              description="Know your fertile window with detailed ovulation tracking and predictions."
              icon={<Droplets className="size-10 text-teal-500" />}
              gradient="from-teal-500/20 to-teal-500/5"
            />
            <FeatureCard
              title="Symptom Analysis"
              description="Track symptoms and discover patterns that help you better understand your body."
              icon={<LineChart className="size-10 text-purple-500" />}
              gradient="from-purple-500/20 to-purple-500/5"
            />
            <FeatureCard
              title="Health Insights"
              description="Personalized insights and educational content about reproductive health."
              icon={<BrainCircuit className="size-10 text-blue-500" />}
              gradient="from-blue-500/20 to-blue-500/5"
            />
            <FeatureCard
              title="Pregnancy Mode"
              description="Seamlessly transition to pregnancy tracking with week-by-week development information."
              icon={<Heart className="size-10 text-pink-500" />}
              gradient="from-pink-500/20 to-pink-500/5"
            />
            <FeatureCard
              title="Private & Secure"
              description="Your data remains private and secure with end-to-end encryption and strict access controls."
              icon={<ShieldCheck className="size-10 text-emerald-500" />}
              gradient="from-emerald-500/20 to-emerald-500/5"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-12 md:mb-16">
            <div className="inline-block rounded-lg bg-foreground/10 px-3 py-1 text-sm">
              Easy to Use
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How Cycly Works
            </h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px]">
              A simple yet powerful approach to period tracking and fertility awareness.
            </p>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-1/2 h-full w-0.5 bg-border transform -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-12 relative">
              <TimelineItem
                step="1"
                title="Log Your Period"
                description="Enter your period start and end dates with details about flow intensity."
                align="right"
              />
              <TimelineItem
                step="2"
                title="Track Symptoms"
                description="Record physical and emotional symptoms throughout your cycle."
                align="left"
              />
              <TimelineItem
                step="3"
                title="View Predictions"
                description="See accurate predictions for your upcoming periods and fertility windows."
                align="right"
              />
              <TimelineItem
                step="4"
                title="Gain Insights"
                description="Receive personalized insights about your unique patterns and cycles."
                align="left"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 container mx-auto">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-100 to-purple-100 dark:from-rose-950/40 dark:to-purple-950/40 p-8 md:p-10 shadow-lg border border-foreground/10">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Start Taking Control of Your Cycle Today
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Join thousands of users who are gaining deeper insights into their bodies and cycles.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-md" asChild>
                <Link href="/app-dashboard">
                  Get Started for Free
                </Link>
              </Button>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-purple-200 mix-blend-multiply blur-2xl opacity-70 dark:bg-purple-900/30 pointer-events-none" />
            <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-rose-200 mix-blend-multiply blur-2xl opacity-70 dark:bg-rose-900/30 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-rose-400 to-purple-500 text-transparent bg-clip-text">
                Cycly
              </Link>
              <p className="mt-4 text-muted-foreground">
                Empowering individuals through cycle awareness and health insights.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="#features" className="text-muted-foreground hover:text-foreground block">Features</Link>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground block">How It Works</Link>
                <Link href="/auth" className="text-muted-foreground hover:text-foreground block">Sign In</Link>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <div className="space-y-2">
                <Link href="#" className="text-muted-foreground hover:text-foreground block">Privacy Policy</Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground block">Terms of Service</Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground block">Cookie Policy</Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Cycly Period Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
  gradient
}: {
  title: string,
  description: string,
  icon: React.ReactNode,
  gradient: string
}) {
  return (
    <div className={cn(
      "group relative rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md",
      "hover:-translate-y-1 duration-300"
    )}>
      <div className={cn(
        "absolute inset-0 rounded-xl bg-gradient-to-br opacity-[0.08]",
        gradient
      )} />
      <div className="relative z-10">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-medium mb-2 group-hover:text-rose-500 transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function TimelineItem({
  step,
  title,
  description,
  align
}: {
  step: string,
  title: string,
  description: string,
  align: "left" | "right"
}) {
  return (
    <div className="flex flex-col md:flex-row items-center">
      <div className={cn(
        "md:w-1/2",
        align === "right" ? "md:order-1 md:pr-12" : "md:order-2 md:pl-12"
      )}>
        <div className={cn(
          "bg-background rounded-lg p-6 shadow-sm border relative",
          align === "right" ? "md:text-right" : "md:text-left",
          "transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
        )}>
          <div className="absolute top-0 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 text-white font-bold text-sm">
            {step}
          </div>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className={cn(
        "hidden md:block md:w-1/2",
        align === "right" ? "md:order-2" : "md:order-1"
      )}>
        {/* This could be an image or illustration */}
      </div>
    </div>
  )
}
