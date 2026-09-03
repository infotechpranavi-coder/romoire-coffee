'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { SITE_NAME } from "@/lib/branding";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Credentials: romoire@gmail.com / Admin@123
    if (email === "romoire@gmail.com" && password === "Admin@123") {
      // Set session cookie for 24 hours
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);
      document.cookie = `admin_session=authenticated; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      
      // Successful login - redirect to dashboard
      router.push("/dashboard");
    } else {
      // Wrong credentials
      setError("Invalid email or password. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <BrandLogo size="lg" asLink={false} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your {SITE_NAME} portal</p>
        </div>

        <Card className="shadow-xl border-slate-200/60 bg-cream">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-800">
              Admin Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-100">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="romoire@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/10 bg-slate-50/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/10 bg-slate-50/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-md shadow-primary/10 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} {SITE_NAME} Administration Portal
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
