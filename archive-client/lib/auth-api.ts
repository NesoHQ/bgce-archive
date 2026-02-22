const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    full_name?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    uuid: string;
    username: string;
    email: string;
    full_name?: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
    meta?: Record<string, any>;
}

export interface LoginResponse {
    token: string;
    user: UserResponse;
}

export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

export class AuthAPI {
    static async register(data: RegisterRequest): Promise<ApiResponse<UserResponse>> {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    }

    static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    }

    static saveToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    static getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    static removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    static saveUser(user: UserResponse) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    static getUser(): UserResponse | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    static removeUser() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    }

    static logout() {
        this.removeToken();
        this.removeUser();
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
