import AnimatedAuthPage from "@/components/animated-auth-page";
import { AuthForm } from "@/components/auth-form";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign In | Cycly Period Tracker",
  description: "Sign in to your Cycly account to track your cycle and manage your reproductive health."
};

export default function AuthPage() {
  return (
    <AnimatedAuthPage>
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="group h-7 px-2 rounded-md"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:translate-x-[-2px] transition-transform" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
        
        <AuthForm />
      </div>
    </AnimatedAuthPage>
  );
}
