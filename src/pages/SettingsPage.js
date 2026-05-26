import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import ParticleBackground from "@/components/ParticleBackground";
import ProfileDropdown from "@/components/ProfileDropdown";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
const THEMES = [
    { id: "lavender", color: "hsl(262,83%,58%)", name: "Lavender" },
    { id: "rose", color: "hsl(340,80%,60%)", name: "Rose" },
    { id: "sky", color: "hsl(200,80%,55%)", name: "Sky" },
    { id: "mint", color: "hsl(160,60%,50%)", name: "Mint" },
    { id: "amber", color: "hsl(38,90%,55%)", name: "Amber" },
    { id: "coral", color: "hsl(16,80%,60%)", name: "Coral" },
    { id: "teal", color: "hsl(180,60%,45%)", name: "Teal" },
    { id: "violet", color: "hsl(280,70%,55%)", name: "Violet" },
    { id: "peach", color: "hsl(25,80%,65%)", name: "Peach" },
    { id: "sage", color: "hsl(140,30%,55%)", name: "Sage" },
];
const SettingsPage = () => {
    const { user, updateProfile, isDark, toggleDark, logout } = useApp();
    const navigate = useNavigate();
    const [careerGoal, setCareerGoal] = useState(user.careerGoal);
    const [skills, setSkills] = useState(user.knownSkills.join(", "));
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const saveCareer = async () => {
        setIsSaving(true);
        setShowSuccess(false);
        await updateProfile({
            careerGoal,
            knownSkills: skills.split(",").map(s => s.trim()).filter(Boolean),
        });
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        }, 800);
    };
    return (_jsxs("div", { className: "min-h-screen gradient-bg relative", children: [_jsx(ParticleBackground, {}), _jsx(ProfileDropdown, {}), _jsxs("div", { className: "relative z-10 max-w-2xl mx-auto p-4 md:p-8", children: [_jsxs("button", { onClick: () => navigate("/dashboard"), className: "flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " Dashboard"] }), _jsx("h1", { className: "text-2xl font-bold text-foreground mb-6", children: "\u2699\uFE0F Settings" }), _jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", children: [_jsx("h2", { className: "font-bold text-foreground mb-4", children: "\uD83C\uDFA8 Theme & Appearance" }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("span", { className: "text-foreground text-sm", children: "Dark Mode" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Sun, { className: "w-4 h-4 text-muted-foreground" }), _jsx(Switch, { checked: isDark, onCheckedChange: toggleDark }), _jsx(Moon, { className: "w-4 h-4 text-muted-foreground" })] })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "Theme Color" }), _jsx("div", { className: "flex flex-wrap gap-2", children: THEMES.map((t) => (_jsx("button", { onClick: () => updateProfile({ theme: t.id }), className: `w-8 h-8 rounded-full border-2 transition-all ${user.theme === t.id
                                        ? "border-foreground scale-110"
                                        : "border-transparent"}`, style: { backgroundColor: t.color }, title: t.name }, t.id))) }), _jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "Font Size" }), _jsx("div", { className: "flex gap-2", children: ["small", "medium", "large"].map((s) => (_jsx("button", { onClick: () => updateProfile({ fontSize: s }), className: `px-4 py-2 rounded-lg text-sm capitalize ${user.fontSize === s
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground"}`, children: s }, s))) })] })] }), _jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", style: { animationDelay: "0.1s" }, children: [_jsx("h2", { className: "font-bold text-foreground mb-4", children: "\uD83C\uDFAF Career Preferences" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-muted-foreground", children: "Career Goal" }), _jsx("select", { value: careerGoal, onChange: (e) => setCareerGoal(e.target.value), className: "w-full mt-1 p-2 rounded-lg bg-secondary text-foreground border border-border", children: ["Job", "Internship", "Higher Studies", "Startup"].map((o) => (_jsx("option", { children: o }, o))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-muted-foreground", children: "Skills (comma separated)" }), _jsx(Input, { value: skills, onChange: (e) => setSkills(e.target.value) })] }), _jsx(Button, { onClick: saveCareer, className: "w-full btn-glow transition-all active:scale-95", disabled: isSaving, children: isSaving ? "Updating..." : "Update Preferences" }), showSuccess && (_jsx("p", { className: "text-green-500 text-sm mt-2 text-center", children: "\u2705 Preferences Updated" }))] })] }), _jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", style: { animationDelay: "0.2s" }, children: [_jsx("h2", { className: "font-bold text-foreground mb-4", children: "\uD83D\uDD14 Notifications" }), _jsx("div", { className: "space-y-3", children: [
                                    "Daily Reminder",
                                    "Challenge Reminder",
                                    "Motivation Messages",
                                ].map((n) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-foreground", children: n }), _jsx(Switch, { defaultChecked: true })] }, n))) })] }), _jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", style: { animationDelay: "0.3s" }, children: [_jsx("h2", { className: "font-bold text-foreground mb-4", children: "\uD83D\uDD10 Account" }), _jsx(Button, { variant: "outline", className: "w-full text-destructive", onClick: async () => {
                                    await logout();
                                    navigate("/");
                                }, children: "Logout" })] })] })] }));
};
export default SettingsPage;
