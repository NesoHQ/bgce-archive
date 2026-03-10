"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, Mail, User, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthAPI } from "@/lib/auth-api";
import { FormField } from "./register/FormField";
import { PasswordInput } from "./register/PasswordInput";
import { PasswordStrengthIndicator } from "./register/PasswordStrengthIndicator";
import { usePasswordStrength } from "./register/usePasswordStrength";

export function RegisterFormOptimized() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { calculatePasswordStrength } = usePasswordStrength();

    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const registerMutation = useMutation({
        mutationFn: AuthAPI.register,
        onSuccess: (response) => {
            if (response.status && response.data) {
                router.push("/login?registered=true");
            }
        },
        onError: (mutationError) => {
            setError(
                mutationError instanceof Error
                    ? mutationError.message
                    : "Registration failed. Please try again.",
            );
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        registerMutation.mutate({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            full_name: formData.name,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <FormField
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                    required
                />

                <FormField
                    id="name"
                    name="name"
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                />

                <FormField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                    required
                />

                <div>
                    <PasswordInput
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        label="Password"
                        required
                    />
                    <PasswordStrengthIndicator
                        password={formData.password}
                        strength={passwordStrength}
                    />
                </div>

                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    label="Confirm Password"
                    icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
                    required
                />

                <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] dark:text-white"
                >
                    {registerMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            <UserPlus className="mr-2 h-5 w-5" />
                            Create account
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
