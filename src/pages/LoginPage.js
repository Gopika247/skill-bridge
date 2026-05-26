import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import ParticleBackground from "@/components/ParticleBackground";
import AIRobot from "@/components/AIRobot";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Eye, EyeOff } from "lucide-react";
const LoginPage = () => {
    const { isDark, toggleDark } = useApp();
    const { toast } = useToast();
    const [view, setView] = useState("login");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotSent, setForgotSent] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const validate = () => {
        const e = {};
        if (view === "signup" && !form.username.trim())
            e.username = "Username is required";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
            e.email = "Valid email is required";
        if (!form.password || form.password.length < 6)
            e.password = "Password must be at least 6 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        setLoading(true);
        setErrors({});
        try {
            if (view === "signup") {
                const { data, error } = await supabase.auth.signUp({
                    email: form.email,
                    password: form.password,
                    options: {
                        data: { full_name: form.username },
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    },
                });
                if (error)
                    throw error;
                if (data?.user?.identities?.length === 0) {
                    setErrors({ email: "An account with this email already exists." });
                }
                else {
                    toast({
                        title: "Check your email! 📧",
                        description: "We sent a link to confirm your account."
                    });
                    setView("login");
                }
            }
            else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: form.email,
                    password: form.password,
                });
                if (error)
                    throw error;
                toast({ title: "Welcome back! ✨" });
            }
        }
        catch (error) {
            toast({
                title: "Authentication Error",
                description: error.message,
                variant: "destructive"
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleForgot = async () => {
        if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
            setErrors({ forgotEmail: "Enter a valid email" });
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        setLoading(false);
        if (error) {
            setErrors({ forgotEmail: error.message });
            return;
        }
        setForgotSent(true);
    };
    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error)
                throw error;
        }
        catch (error) {
            toast({
                title: "Google Login Error",
                description: error.message,
                variant: "destructive"
            });
        }
    };
    if (loading && view === "login")
        return _jsx(LoadingSpinner, { message: "Accessing your career portal..." });
    return (_jsxs("div", { className: "min-h-screen gradient-bg relative flex flex-col items-center justify-start p-4 pt-8", children: [_jsx(ParticleBackground, {}), _jsx("button", { type: "button", onClick: toggleDark, className: "absolute top-4 right-4 z-20 p-2 rounded-full glass-card", children: isDark ? _jsx(Sun, { className: "w-5 h-5 text-foreground" }) : _jsx(Moon, { className: "w-5 h-5 text-foreground" }) }), _jsxs("div", { className: "relative z-10 flex flex-col items-center text-center animate-fade-in mb-6", children: [_jsx(AIRobot, { size: "lg" }), _jsx("h1", { className: "text-3xl md:text-4xl font-bold text-foreground mt-4", children: "AI Career Mentor" }), _jsx("p", { className: "text-muted-foreground mt-2 text-base max-w-md", children: "Your future career starts with the right skills \u2014 let AI guide you." })] }), _jsx("div", { className: "relative z-10 flex items-center justify-center w-full flex-1", children: _jsx("div", { className: "w-full max-w-md animate-scale-in", children: _jsxs("div", { className: "glass-card p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-foreground mb-6", children: view === "login" ? "Welcome 👋" : view === "signup" ? "Create Account 🚀" : "Reset Password 🔑" }), view === "forgot" ? (_jsxs("div", { className: "space-y-4", children: [!forgotSent ? (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx(Label, { children: "Email" }), _jsx(Input, { value: forgotEmail, onChange: e => setForgotEmail(e.target.value), placeholder: "your@email.com", className: "input-glow mt-1" }), errors.forgotEmail && _jsx("p", { className: "text-destructive text-sm mt-1", children: errors.forgotEmail })] }), _jsx(Button, { onClick: handleForgot, disabled: loading, className: "w-full btn-glow", children: loading ? "Sending..." : "Send Reset Link" })] })) : (_jsxs("div", { className: "text-center space-y-4", children: [_jsx("p", { className: "text-green-500 font-medium", children: "\u2705 Reset email sent!" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Check your inbox and follow the instructions." })] })), _jsx("button", { type: "button", onClick: () => { setView("login"); setForgotSent(false); }, className: "text-primary text-sm hover:underline w-full text-center", children: "\u2190 Back to Login" })] })) : (_jsxs("div", { className: "space-y-4", children: [view === "signup" && (_jsxs("div", { children: [_jsx(Label, { children: "Username" }), _jsx(Input, { name: "username", value: form.username, onChange: handleChange, placeholder: "Enter username", className: "input-glow mt-1" }), errors.username && _jsx("p", { className: "text-destructive text-sm mt-1", children: errors.username })] })), _jsxs("div", { children: [_jsx(Label, { children: "Email" }), _jsx(Input, { name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "your@email.com", className: "input-glow mt-1" }), errors.email && _jsx("p", { className: "text-destructive text-sm mt-1", children: errors.email })] }), _jsxs("div", { children: [_jsx(Label, { children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { name: "password", type: showPass ? "text" : "password", value: form.password, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "input-glow mt-1 pr-10" }), _jsx("button", { type: "button", onClick: () => setShowPass(!showPass), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: showPass ? _jsx(Eye, { className: "w-4 h-4" }) : _jsx(EyeOff, { className: "w-4 h-4" }) })] }), errors.password && _jsx("p", { className: "text-destructive text-sm mt-1", children: errors.password })] }), _jsx(Button, { onClick: handleSubmit, disabled: loading, className: "w-full btn-glow", children: loading ? "Loading..." : view === "login" ? "Login" : "Create Account" }), _jsxs("div", { className: "relative my-4", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-border" }) }), _jsx("div", { className: "relative flex justify-center text-xs", children: _jsx("span", { className: "bg-card px-2 text-muted-foreground", children: "or" }) })] }), _jsxs(Button, { variant: "outline", className: "w-full gap-2", onClick: handleGoogleLogin, children: [_jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })] }), "Continue with Google"] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("button", { type: "button", onClick: () => { setView(view === "login" ? "signup" : "login"); setErrors({}); }, className: "text-primary hover:underline", children: view === "login" ? "Create Account" : "Already have account? Login" }), view === "login" && (_jsx("button", { type: "button", onClick: () => setView("forgot"), className: "text-muted-foreground hover:underline", children: "Forgot Password?" }))] })] }))] }) }) })] }));
};
export default LoginPage;
