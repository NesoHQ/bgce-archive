<script setup lang="ts">
import { ref } from "vue";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Shield } from "lucide-vue-next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const authStore = useAuthStore();

const schema = yup.object({
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: schema,
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const showPassword = ref(false);
const isSubmitting = ref(false);

const onSubmit = handleSubmit(async values => {
    try {
        isSubmitting.value = true;
        await authStore.login({
            email: values.email,
            password: values.password,
        });
    } catch (error) {
        console.error("Login failed:", error);
    } finally {
        isSubmitting.value = false;
    }
});
</script>

<template>
    <div class="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <!-- Logo and Brand -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-card-foreground mb-2">Archive Login</h1>
                <p class="text-muted-foreground">Secure access to your digital archive</p>
            </div>

            <!-- Login Card -->
            <Card class="shadow-lg border-archive-muted/20 bg-card/95 backdrop-blur-sm">
                <CardHeader class="space-y-1">
                    <CardTitle class="text-2xl font-semibold text-center">Welcome Back</CardTitle>
                    <CardDescription class="text-center">
                        Enter your credentials to access the archive
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                    <!-- Form with VeeValidate submit handler -->
                    <form @submit="onSubmit" class="space-y-4">
                        <!-- Email Field -->
                        <div class="space-y-2">
                            <Label for="email" class="text-sm font-medium">
                                Email Address
                            </Label>
                            <Input id="email" type="email" placeholder="admin@bgce.com"
                                class="h-11 bg-background/50 border-archive-muted/30 focus:border-archive-primary"
                                v-model="email" v-bind="emailAttrs" :disabled="isSubmitting" />
                            <!-- Display error message if present -->
                            <p v-if="errors.email" class="text-destructive text-sm">{{ errors.email }}</p>
                        </div>

                        <!-- Password Field -->
                        <div class="space-y-2">
                            <Label for="password" class="text-sm font-medium">
                                Password
                            </Label>
                            <div class="relative">
                                <Input id="password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="Enter your password"
                                    class="h-11 bg-background/50 border-archive-muted/30 focus:border-archive-primary pr-10"
                                    v-model="password" v-bind="passwordAttrs" :disabled="isSubmitting" />
                                <Button type="button" variant="ghost" size="sm"
                                    class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    @click="showPassword = !showPassword" :disabled="isSubmitting">
                                    <EyeOff v-if="showPassword" class="w-4 h-4 text-muted-foreground" />
                                    <Eye v-else class="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                            <p v-if="errors.password" class="text-destructive text-sm">{{ errors.password }}</p>
                        </div>

                        <!-- Remember Me & Forgot Password -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <input type="checkbox" id="remember"
                                    class="w-4 h-4 text-archive-primary bg-background border-archive-muted/30 rounded focus:ring-archive-primary focus:ring-2" 
                                    :disabled="isSubmitting" />
                                <Label for="remember" class="text-sm text-muted-foreground">
                                    Remember me
                                </Label>
                            </div>
                            <Button variant="link"
                                class="text-sm text-archive-primary hover:text-archive-primary/80 p-0 cursor-pointer"
                                :disabled="isSubmitting">
                                Forgot password?
                            </Button>
                        </div>

                        <!-- Login Button -->
                        <Button type="submit"
                            class="w-full h-11 bg-archive-primary hover:bg-archive-primary/90 text-white font-medium cursor-pointer"
                            :disabled="isSubmitting || authStore.loading">
                            <Shield class="w-4 h-4 mr-2" />
                            {{ isSubmitting || authStore.loading ? 'Logging in...' : 'Login to Archive' }}
                        </Button>
                    </form>

                    <!-- Security Notice -->
                    <div class="text-center">
                        <p class="text-xs text-muted-foreground">
                            Protected by enterprise-grade security
                        </p>
                    </div>
                </CardContent>
            </Card>

            <!-- Footer -->
            <div class="text-center mt-8">
                <p class="text-sm text-muted-foreground/70">
                    © 2025 Best Golang Community Ever. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</template>
