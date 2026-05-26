import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import ParticleBackground from "@/components/ParticleBackground";
import ProfileDropdown from "@/components/ProfileDropdown";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Confetti from "@/components/Confetti";
// ---------------- PROJECTS ----------------
const projects = [
    // 🟢 EASY PROJECTS
    {
        title: "To-Do List App",
        level: "Easy",
        desc: "Simple task manager app",
        definition: "A basic app where users can add, delete, and mark tasks as completed.",
        why: "Helps understand basic app logic used in all software apps.",
        learn: "CRUD operations, state management, UI basics.",
        tools: "React / JavaScript",
        steps: [
            "Create input field",
            "Add task to list",
            "Display tasks",
            "Delete task",
            "Mark as completed",
        ],
    },
    {
        title: "Weather App",
        level: "Easy",
        desc: "Live weather tracker",
        definition: "An app that shows real-time weather details of any city using API.",
        why: "Teaches API integration used in real-world apps.",
        learn: "Fetching API data, JSON handling.",
        tools: "React + Weather API",
        steps: [
            "Get API key",
            "Create search input",
            "Fetch weather data",
            "Display temperature",
            "Show weather icon",
        ],
    },
    {
        title: "Calculator App",
        level: "Easy",
        desc: "Basic arithmetic calculator",
        definition: "A simple calculator that performs basic math operations.",
        why: "Builds logic and event handling skills.",
        learn: "Functions, events, conditions.",
        tools: "HTML / CSS / JavaScript",
        steps: [
            "Create UI buttons",
            "Capture input values",
            "Perform calculations",
            "Display result",
            "Add clear button",
        ],
    },
    {
        title: "Notes App",
        level: "Easy",
        desc: "Save personal notes",
        definition: "An app where users can write, save, and delete notes using browser storage.",
        why: "Teaches local storage concept.",
        learn: "localStorage, CRUD, UI updates.",
        tools: "React / JS",
        steps: [
            "Create note input",
            "Save to localStorage",
            "Display notes",
            "Delete notes",
            "Persist data on reload",
        ],
    },
    // 🟡 MEDIUM PROJECTS
    {
        title: "E-Commerce UI",
        level: "Medium",
        desc: "Shopping website frontend",
        definition: "A product listing website where users can view items like an online store.",
        why: "Real-world UI design practice used in companies.",
        learn: "Components, routing, UI structuring.",
        tools: "React + Tailwind CSS",
        steps: [
            "Design product cards",
            "Create homepage",
            "Add navigation",
            "Build cart UI",
            "Make responsive design",
        ],
    },
    {
        title: "Login Authentication System",
        level: "Medium",
        desc: "User login/signup system",
        definition: "A system where users can register, login, and access protected pages.",
        why: "Almost every app uses authentication.",
        learn: "Form validation, auth flow.",
        tools: "React + Firebase / Node.js",
        steps: [
            "Create signup form",
            "Create login form",
            "Validate inputs",
            "Store user data",
            "Protect routes",
        ],
    },
    // 🔴 HARD PROJECTS
    {
        title: "Job Portal (Full Stack)",
        level: "Hard",
        desc: "Job posting & applying platform",
        definition: "A full system where companies post jobs and users apply for them.",
        why: "Real industry-level project for placements.",
        learn: "Full stack development, database, APIs.",
        tools: "React + Node.js + MongoDB",
        steps: [
            "Design UI",
            "Create backend APIs",
            "Setup database",
            "Add job posting system",
            "Enable apply feature",
            "Deploy full app",
        ],
    },
    {
        title: "AI Chatbot System",
        level: "Hard",
        desc: "Smart AI assistant chatbot",
        definition: "A chatbot that can answer user questions using AI or API integration.",
        why: "Modern AI skill used in top companies.",
        learn: "API integration, AI logic handling.",
        tools: "React + OpenAI API",
        steps: [
            "Create chat UI",
            "Connect AI API",
            "Send user input",
            "Receive response",
            "Improve conversation flow",
        ],
    },
];
// ---------------- COMPONENT ----------------
const MiniProjectsPage = () => {
    const { user, updateUser } = useApp();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const markComplete = (title) => {
        if (!user.completedProjects.includes(title)) {
            updateUser({
                completedProjects: [...user.completedProjects, title],
                points: user.points + 50,
            });
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };
    return (_jsxs("div", { className: "min-h-screen gradient-bg relative", children: [_jsx(ParticleBackground, {}), _jsx(ProfileDropdown, {}), _jsx(Confetti, { show: showConfetti }), _jsxs("div", { className: "relative z-10 max-w-4xl mx-auto p-4 md:p-8", children: [_jsxs("button", { onClick: () => navigate("/dashboard"), className: "flex items-center gap-2 text-muted-foreground mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " Dashboard"] }), _jsx("h1", { className: "text-2xl font-bold mb-6", children: "\uD83E\uDDE9 Mini Projects (Easy \u2192 Hard Roadmap)" }), selected === null ? (_jsx("div", { className: "grid md:grid-cols-2 gap-4", children: projects.map((p, i) => (_jsxs("div", { onClick: () => setSelected(i), className: "glass-card-hover p-5 cursor-pointer", children: [_jsxs("h3", { className: "font-bold", children: [p.title, " ", _jsxs("span", { className: "text-xs ml-2", children: ["(", p.level, ")"] })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: p.desc }), _jsxs("p", { className: "text-xs mt-2", children: ["\uD83D\uDEE0 ", p.tools] })] }, i))) })) : (_jsxs("div", { className: "glass-card p-6", children: [_jsx("button", { onClick: () => setSelected(null), className: "text-sm mb-4 text-primary", children: "\u2190 Back" }), _jsx("h2", { className: "text-xl font-bold", children: projects[selected].title }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: ["Level: ", projects[selected].level] }), _jsx("p", { className: "mt-3", children: projects[selected].desc }), _jsx("h3", { className: "mt-4 font-semibold", children: "\uD83D\uDCCC What is this?" }), _jsx("p", { className: "text-sm", children: projects[selected].definition }), _jsx("h3", { className: "mt-4 font-semibold", children: "\uD83C\uDFAF Why this project?" }), _jsx("p", { className: "text-sm", children: projects[selected].why }), _jsx("h3", { className: "mt-4 font-semibold", children: "\uD83E\uDDE0 What you will learn" }), _jsx("p", { className: "text-sm", children: projects[selected].learn }), _jsx("h3", { className: "mt-4 font-semibold", children: "\uD83D\uDEE0 Tools" }), _jsx("p", { className: "text-sm", children: projects[selected].tools }), _jsx("h3", { className: "mt-4 font-semibold", children: "\uD83D\uDCCB Steps" }), _jsx("ul", { className: "list-disc ml-5 text-sm space-y-1", children: projects[selected].steps.map((s, i) => (_jsx("li", { children: s }, i))) }), !user.completedProjects.includes(projects[selected].title) && (_jsx(Button, { className: "mt-5", onClick: () => markComplete(projects[selected].title), children: "Mark Completed \u2705" }))] }))] })] }));
};
export default MiniProjectsPage;
