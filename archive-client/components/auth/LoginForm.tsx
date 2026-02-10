"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn, Mail, Lock, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full" type="button">
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
        <Button variant="outline" className="w-full" type="button">
          <FaGithub className="mr-2 h-5 w-5" />
          Github
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
          >
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="bg-background/50 h-11 focus-visible:ring-primary/30 transition-all border-border/60 hover:border-primary/50"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-muted-foreground" />
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="bg-background/50 pr-10 h-11 focus-visible:ring-primary/30 transition-all border-border/60 hover:border-primary/50"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Sign in
        </Button>
      </form>
    </div>
  );
}
