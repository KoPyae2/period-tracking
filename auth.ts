import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import { v5 as uuidv5 } from "uuid";
import type { JWT } from "next-auth/jwt";
import type { Session, User as DefaultUser } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
    }
    
    interface User {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id: string;
    }
  }
  
  // UUID namespace for consistent ID generation
  const NAMESPACE = "a98eef6f-170a-492d-9ae5-257570db6a74"; // Custom namespace UUID

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // In a real app, you'd check the credentials against your database
                if (!credentials?.email || !credentials?.password) return null;

                // This is a simple mock implementation
                // For demo purposes only - replace with actual user verification
                if (credentials.email === "user@example.com" && credentials.password === "password") {
                    return {
                        id: "1",
                        email: "user@example.com",
                        
                        name: "Demo User",
                    };
                }

                // Return null if user credentials not matched
                return null;
            },
        }),
    ],
    // Let NextAuth.js automatically determine the URL
    useSecureCookies: process.env.NODE_ENV === "production",
    debug: process.env.NODE_ENV === "development",
    callbacks: {
        async signIn({ user }: { user: DefaultUser }) {
            try {
                if (!user.email) {
                    console.error("User email is required for sign in");
                    return false;
                }

                // Generate a deterministic UUID from the email for consistency
                // Using UUID v5 which generates the same UUID for the same input (email)
                const userId = uuidv5(user.email, NAMESPACE);

                // First try to find user by email (most reliable)
                const { data: existingUser, error: findError } = await supabase
                    .from("users")
                    .select("id")
                    .eq("email", user.email)
                    .single();

                if (findError && findError.code !== "PGRST116") {
                    console.error("Error checking user existence:", findError);
                    // Continue anyway, we'll try to create the user
                }

                if (existingUser) {
                    // User exists - update the JWT with this ID
                    user.id = existingUser.id;
                    return true;
                }

                // User doesn't exist, create a new one
                const { error: insertError } = await supabase
                    .from("users")
                    .insert({
                        id: userId,
                        email: user.email,
                        name: user.name || null,
                        image: user.image || null,
                        average_cycle_length: 28, // Default value
                    });

                if (insertError) {
                    console.error("Error creating user:", insertError);
                    return false;
                }

                // Set the user ID for the JWT
                user.id = userId;
                return true;
            } catch (error) {
                console.error("Unexpected error during sign in:", error);
                return false;
            }
        },
        async jwt({ token, user }: { token: JWT; user?: DefaultUser }) {
            // Add the user ID to the token when a user signs in
            if (user && user.id) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            // Add the user ID from the token to the session
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth",
        error: "/auth",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET!,
})