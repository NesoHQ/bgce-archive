"use client";

import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthWrapper
      headerTitle="Welcome back"
      headerDescription="Enter your credentials to access your account"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthWrapper>
  );
}
