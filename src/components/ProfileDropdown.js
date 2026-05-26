import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, User, Settings, FileText, LogOut, ChevronDown } from "lucide-react";
const ProfileDropdown = () => {
    const { user, isDark, toggleDark, logout } = useApp();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target))
            setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning ☀️" : hour < 18 ? "Good Afternoon 🌤️" : "Good Evening 🌙";
    return (_jsxs("div", { className: "fixed top-4 right-4 z-50 flex items-center gap-2", ref: ref, children: [_jsx("button", { onClick: toggleDark, className: "p-2 rounded-full glass-card", children: isDark ? _jsx(Sun, { className: "w-4 h-4 text-foreground" }) : _jsx(Moon, { className: "w-4 h-4 text-foreground" }) }), _jsxs("button", { onClick: () => setOpen(!open), className: "flex items-center gap-2 glass-card px-3 py-2 rounded-full", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center", children: user.profilePhoto ? _jsx("img", { src: user.profilePhoto, className: "w-8 h-8 rounded-full object-cover" }) : _jsx(User, { className: "w-4 h-4 text-primary" }) }), _jsx("span", { className: "text-sm font-medium text-foreground hidden sm:block", children: user.username || "User" }), _jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })] }), open && (_jsxs("div", { className: "absolute top-full right-0 mt-2 w-56 glass-card rounded-xl p-2 animate-scale-in", children: [_jsxs("div", { className: "px-3 py-2 border-b border-border mb-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: greeting }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Hi, ", user.username || "User", " \uD83D\uDE04"] })] }), [
                        { label: "View Profile", icon: User, path: "/profile" },
                        { label: "Settings", icon: Settings, path: "/settings" },
                        { label: "My Resumes", icon: FileText, path: "/resume-builder" },
                    ].map(item => (_jsxs("button", { onClick: () => { navigate(item.path); setOpen(false); }, className: "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/60 text-sm text-foreground", children: [_jsx(item.icon, { className: "w-4 h-4" }), " ", item.label] }, item.label))), _jsxs("button", { onClick: () => { logout(); navigate("/"); setOpen(false); }, className: "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-sm text-destructive mt-1", children: [_jsx(LogOut, { className: "w-4 h-4" }), " Logout"] })] }))] }));
};
export default ProfileDropdown;
