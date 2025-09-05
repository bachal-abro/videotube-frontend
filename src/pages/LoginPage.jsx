import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    AlertCircle,
    Loader2,
    User,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { logOut, setCredentials } from "../features/auth/authSlice";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        emailOrUsername: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const { user } = useSelector((state) => state.auth);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [user]);

    const isEmail = (value) => {
        return /\S+@\S+\.\S+/.test(value);
    };

    const isValidUsername = (value) => {
        return /^[a-zA-Z0-9_]+$/.test(value) && value.length >= 3;
    };

    const validateForm = () => {
        const newErrors = {};

        // Email or Username validation
        if (!formData.emailOrUsername) {
            newErrors.emailOrUsername = "Email or username is required";
        } else {
            const value = formData.emailOrUsername.trim();
            if (!isEmail(value) && !isValidUsername(value)) {
                newErrors.emailOrUsername =
                    "Please enter a valid email address or username (3+ characters, letters, numbers, and underscores only)";
            }
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const loginData = {
                password: formData.password,
            };

            // Determine if input is email or username
            if (isEmail(formData.emailOrUsername)) {
                loginData.email = formData.emailOrUsername;
            } else {
                loginData.username = formData.emailOrUsername;
            }

            const result = await login(loginData).unwrap();

            dispatch(
                setCredentials({
                    user: result.data.user,
                    accessToken: result.data.accessToken,
                })
            );

            toast({
                title: "Welcome back!",
                description: "You have been successfully logged in.",
            });

            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login failed:", error);
            toast({
                title: "Login failed",
                description:
                    error?.data?.message ||
                    "Invalid credentials. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDemoLogin = async () => {
        setFormData({
            emailOrUsername: "demo@videotube.com",
            password: "demo123",
        });

        // Auto-submit after setting demo credentials
        setTimeout(() => {
            handleSubmit({ preventDefault: () => {} });
        }, 100);
    };

    // Determine which icon to show based on input
    const getInputIcon = () => {
        if (!formData.emailOrUsername) {
            return (
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            );
        }
        return isEmail(formData.emailOrUsername) ? (
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        ) : (
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        );
    };

    const getInputPlaceholder = () => {
        return "Enter your email or username";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="w-6 h-6"
                            >
                                <path d="M4 4l16 8-16 8z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold">VideoTube</span>
                    </Link>
                </div>

                {/* Login Card */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">
                            Welcome back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Demo Login Alert */}
                        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-blue-800 dark:text-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">
                                        Try the demo account
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDemoLogin}
                                        className="h-7 text-xs border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900 bg-transparent"
                                    >
                                        Demo Login
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email or Username Field */}
                            <div className="space-y-2">
                                <Label htmlFor="emailOrUsername">
                                    Email or Username
                                </Label>
                                <div className="relative">
                                    {getInputIcon()}
                                    <Input
                                        id="emailOrUsername"
                                        name="emailOrUsername"
                                        type="text"
                                        placeholder={getInputPlaceholder()}
                                        value={formData.emailOrUsername}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${
                                            errors.emailOrUsername
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {formData.emailOrUsername && (
                                    <p className="text-xs text-muted-foreground">
                                        {isEmail(formData.emailOrUsername)
                                            ? "✓ Email format detected"
                                            : "✓ Username format detected"}
                                    </p>
                                )}
                                {errors.emailOrUsername && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.emailOrUsername}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 ${
                                            errors.password
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        }`}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" disabled={isLoading}>
                                <svg
                                    className="mr-2 h-4 w-4"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" disabled={isLoading}>
                                <svg
                                    className="mr-2 h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                Don't have an account?{" "}
                            </span>
                            <Link
                                to="/signup"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground">
                    <p>
                        By signing in, you agree to our{" "}
                        <Link to="/terms" className="hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
