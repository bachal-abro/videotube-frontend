import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    AlertCircle,
    Loader2,
    Check,
    X,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Checkbox } from "../components/ui/Checkbox";
import { Progress } from "../components/ui/Progress";
import { Separator } from "../components/ui/Separator";
import { useToast } from "../hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        displayName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    const navigate = useNavigate();
    const { toast } = useToast();
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();
    const { user } = useSelector((state) => state.auth);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 12.5;
        if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
        return Math.min(strength, 100);
    };

    const getPasswordStrengthLabel = (strength) => {
        if (strength < 25) return "Very Weak";
        if (strength < 50) return "Weak";
        if (strength < 75) return "Good";
        return "Strong";
    };

    const getPasswordStrengthColor = (strength) => {
        if (strength < 25) return "bg-red-500";
        if (strength < 50) return "bg-orange-500";
        if (strength < 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const validateForm = () => {
        const newErrors = {};

        // Display name validation
        if (!formData.displayName.trim()) {
            newErrors.displayName = "Display name is required";
        } else if (formData.displayName.trim().length < 2) {
            newErrors.displayName =
                "Display name must be at least 2 characters";
        }

        // Username validation
        if (!formData.username) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username =
                "Username can only contain letters, numbers, and underscores";
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Terms agreement validation
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms =
                "You must agree to the terms and conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Calculate password strength
        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }

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
            const result = await register({
                displayName: formData.displayName.trim(),
                username: formData.username,
                email: formData.email,
                password: formData.password,
            }).unwrap();

            dispatch(
                setCredentials({
                    user: result.data.user,
                    accessToken: result.data.accessToken,
                })
            );

            toast({
                title: "Welcome to VideoTube!",
                description:
                    "Your account has been created successfully. Please go to 'My account' and setup your profile",
            });
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Registration failed:", error);
            toast({
                title: "Registration failed",
                description:
                    error?.data?.message ||
                    "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    };

    const passwordsMatch =
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword;

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

                {/* Signup Card */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">
                            Create your account
                        </CardTitle>
                        <CardDescription>
                            Join VideoTube and start sharing your videos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Display name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="displayName">
                                    Display name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="displayName"
                                        name="displayName"
                                        type="text"
                                        placeholder="Enter your display name"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${
                                            errors.displayName
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.displayName && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.displayName}
                                    </p>
                                )}
                            </div>

                            {/* Username Field */}
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${
                                            errors.username
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {formData.username && !errors.username && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        Username looks good!
                                    </p>
                                )}
                                {errors.username && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.username}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    3+ characters, letters, numbers, and
                                    underscores only
                                </p>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${
                                            errors.email
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.email}
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
                                        placeholder="Create a password"
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
                                {formData.password && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Password strength:
                                            </span>
                                            <span
                                                className={`font-medium ${
                                                    passwordStrength < 50
                                                        ? "text-red-500"
                                                        : passwordStrength < 75
                                                        ? "text-yellow-500"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {getPasswordStrengthLabel(
                                                    passwordStrength
                                                )}
                                            </span>
                                        </div>
                                        <Progress
                                            value={passwordStrength}
                                            className="h-2"
                                        >
                                            <div
                                                className={`h-full transition-all ${getPasswordStrengthColor(
                                                    passwordStrength
                                                )}`}
                                                style={{
                                                    width: `${passwordStrength}%`,
                                                }}
                                            />
                                        </Progress>
                                    </div>
                                )}
                                {errors.password && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 ${
                                            errors.confirmPassword
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : passwordsMatch
                                                ? "border-green-500 focus-visible:ring-green-500"
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
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                    {passwordsMatch && (
                                        <Check className="absolute right-10 top-3 h-4 w-4 text-green-500" />
                                    )}
                                    {formData.confirmPassword &&
                                        !passwordsMatch && (
                                            <X className="absolute right-10 top-3 h-4 w-4 text-red-500" />
                                        )}
                                </div>
                                {passwordsMatch && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        Passwords match!
                                    </p>
                                )}
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="space-y-2">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked) =>
                                            handleInputChange({
                                                target: {
                                                    name: "agreeToTerms",
                                                    type: "checkbox",
                                                    checked,
                                                },
                                            })
                                        }
                                        disabled={isLoading}
                                        className={
                                            errors.agreeToTerms
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <Label
                                        htmlFor="agreeToTerms"
                                        className="text-sm leading-5"
                                    >
                                        I agree to the{" "}
                                        <Link
                                            to="/terms"
                                            className="text-primary hover:underline"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            to="/privacy"
                                            className="text-primary hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </Label>
                                </div>
                                {errors.agreeToTerms && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.agreeToTerms}
                                    </p>
                                )}
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
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
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

                        {/* Sign In Link */}
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                Already have an account?{" "}
                            </span>
                            <Link
                                to="/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground">
                    <p>
                        By creating an account, you agree to our{" "}
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
