import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import ParticleBackground from "@/components/ParticleBackground";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import AIRobot from "@/components/AIRobot";
const SKILL_LIST = ["Python", "Java", "JavaScript", "SQL", "React", "Node.js", "C++", "C#", "TypeScript", "HTML", "CSS", "R", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby", "Scala", "MATLAB", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Docker", "AWS", "Azure", "Git", "Linux", "MongoDB", "PostgreSQL", "MySQL", "Excel", "Tableau", "Power BI", "Figma", "Photoshop"];
const OnboardingPage = () => {
    const { updateProfile } = useApp();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        education: "", careerGoal: "", skillLevel: "", learningTime: "",
        knownSkills: "", mentorName: "",
    });
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const steps = [
        { title: "🧑‍🎓 Education Level", key: "education", type: "select", options: ["School", "Diploma", "Undergraduate", "Postgraduate"], errMsg: "Please select your education level" },
        { title: "💡 Career Goal", key: "careerGoal", type: "select", options: ["Job", "Internship", "Higher Studies", "Startup"], errMsg: "Please choose a career goal" },
        { title: "🛠️ Skill Level", key: "skillLevel", type: "select", options: ["Beginner", "Intermediate", "Advanced"], errMsg: "Please select your skill level" },
        { title: "⏳ Daily Learning Time", key: "learningTime", type: "select", options: ["1 hour", "2–3 hours", "5+ hours"], errMsg: "Please select learning time" },
        { title: "🧾 Known Skills", key: "knownSkills", type: "text", placeholder: "Type any skills, comma-separated (e.g., React, Docker, AWS, Figma)", errMsg: "Enter at least one skill" },
        { title: "🎯 AI Mentor Name", key: "mentorName", type: "text", placeholder: "e.g., MentorX, Aira, Nova", errMsg: "Enter a name for your AI Mentor" },
    ];
    const current = steps[step];
    const validateStep = () => {
        const val = data[current.key];
        if (!val || !val.trim()) {
            setError(current.errMsg);
            return false;
        }
        if (current.key === "knownSkills") {
            const skills = val.split(",").map(s => s.trim()).filter(Boolean);
            if (skills.length === 0) {
                setError(current.errMsg);
                return false;
            }
        }
        setError("");
        return true;
    };
    const handleNext = async () => {
        if (!validateStep())
            return;
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        }
        else {
            setLoading(true);
            const skills = data.knownSkills.split(",").map(s => s.trim()).filter(Boolean);
            await updateProfile({
                education: data.education, careerGoal: data.careerGoal, skillLevel: data.skillLevel,
                learningTime: data.learningTime, knownSkills: skills, mentorName: data.mentorName,
                onboardingComplete: true,
            });
            navigate("/dashboard");
        }
    };
    const handleSkillInput = (val) => {
        setData(p => ({ ...p, knownSkills: val }));
        const last = val.split(",").pop()?.trim().toLowerCase() || "";
        setSuggestions(last.length > 0 ? SKILL_LIST.filter(s => s.toLowerCase().startsWith(last)).slice(0, 5) : []);
    };
    const addSuggestion = (s) => {
        const parts = data.knownSkills.split(",").map(x => x.trim()).filter(Boolean);
        parts.pop();
        parts.push(s);
        setData(p => ({ ...p, knownSkills: parts.join(", ") + ", " }));
        setSuggestions([]);
    };
    if (loading)
        return _jsx(LoadingSpinner, { message: "Setting up your personalized AI career mentor\u2026" });
    return (_jsxs("div", { className: "min-h-screen gradient-bg relative flex items-center justify-center p-4", children: [_jsx(ParticleBackground, {}), _jsxs("div", { className: "relative z-10 w-full max-w-lg animate-scale-in", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between text-sm text-muted-foreground mb-2", children: [_jsxs("span", { children: ["Step ", step + 1, " of ", steps.length] }), _jsxs("span", { children: [Math.round(((step + 1) / steps.length) * 100), "%"] })] }), _jsx(Progress, { value: ((step + 1) / steps.length) * 100, className: "h-2" })] }), _jsxs("div", { className: "glass-card p-8", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx(AIRobot, { size: "sm" }) }), _jsx("h2", { className: "text-2xl font-bold text-foreground mb-6 text-center", children: current.title }), current.type === "select" ? (_jsx("div", { className: "grid grid-cols-2 gap-3", children: current.options?.map(opt => (_jsx("button", { onClick: () => { setData(p => ({ ...p, [current.key]: opt })); setError(""); }, className: `p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${data[current.key] === opt ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-foreground"}`, children: opt }, opt))) })) : (_jsxs("div", { className: "relative", children: [_jsx(Input, { value: data[current.key], onChange: e => current.key === "knownSkills" ? handleSkillInput(e.target.value) : setData(p => ({ ...p, [current.key]: e.target.value })), placeholder: current.placeholder, className: "input-glow", onKeyDown: e => e.key === "Enter" && handleNext() }), suggestions.length > 0 && current.key === "knownSkills" && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-1 glass-card rounded-lg overflow-hidden z-20", children: suggestions.map(s => (_jsx("button", { onClick: () => addSuggestion(s), className: "w-full text-left px-4 py-2 hover:bg-primary/10 text-sm text-foreground", children: s }, s))) }))] })), error && _jsx("p", { className: "text-destructive text-sm mt-3", children: error }), _jsxs("div", { className: "flex gap-3 mt-8", children: [step > 0 && _jsx(Button, { variant: "outline", onClick: () => setStep(s => s - 1), className: "flex-1", children: "Back" }), _jsx(Button, { onClick: handleNext, className: "flex-1 btn-glow", children: step === steps.length - 1 ? "Get Started 🚀" : "Next →" })] })] })] })] }));
};
export default OnboardingPage;
