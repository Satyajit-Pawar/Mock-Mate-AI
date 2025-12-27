import AuthForm from "@/components/auth/auth-form";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back 👋
          </h1>

          <p className="text-sm text-muted-foreground">
            Practice interviews. Improve confidence. Get hired.
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Secure login powered by Firebase Authentication
        </p>
      </div>
    </div>
  );
}
