import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import ParticleBackground from "@/components/ParticleBackground";
import ProfileDropdown from "@/components/ProfileDropdown";
import Confetti from "@/components/Confetti";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
const DailyChallengePage = () => {
    const { user, updateUser } = useApp();
    const navigate = useNavigate();
    const { toast } = useToast();
    const today = new Date().toDateString();
    // Use ALL known skills so questions can be mixed across them
    const skills = useMemo(() => {
        const list = (user.knownSkills && user.knownSkills.length > 0) ? user.knownSkills : ["JavaScript"];
        return list;
    }, [user.knownSkills]);
    const primarySkill = skills[0];
    // Learning day = (max completed days for primary skill) + 1, clamped 1..10
    const learningDay = useMemo(() => {
        const completed = user.completedDays?.[primarySkill] || [];
        const doneCount = completed.filter(Boolean).length;
        return Math.min(10, Math.max(1, doneCount + 1));
    }, [user.completedDays, primarySkill]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [interviewQ, setInterviewQ] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            const [{ data: quiz }, { data: interview }] = await Promise.all([
                supabase
                    .from("daily_quiz")
                    .select("skill, q, options, answer, q_order")
                    .in("skill", skills)
                    .eq("day", learningDay)
                    .order("q_order", { ascending: true }),
                supabase
                    .from("daily_interview")
                    .select("skill, question")
                    .in("skill", skills)
                    .eq("day", learningDay),
            ]);
            if (!active)
                return;
            // Round-robin mix across skills → 4 questions total
            const bySkill = {};
            (quiz || []).forEach((r) => {
                var _a;
                (bySkill[_a = r.skill] || (bySkill[_a] = [])).push(r);
            });
            const order = skills.filter(s => bySkill[s]?.length);
            const mixed = [];
            while (mixed.length < 4 && order.some(s => bySkill[s]?.length)) {
                for (const s of order) {
                    if (mixed.length >= 4)
                        break;
                    const pool = bySkill[s];
                    if (pool && pool.length)
                        mixed.push(pool.shift());
                }
            }
            setQuizQuestions(mixed.map((r) => ({
                q: skills.length > 1 ? `[${r.skill}] ${r.q}` : r.q,
                options: Array.isArray(r.options) ? r.options : JSON.parse(r.options),
                answer: r.answer,
            })));
            // Rotate interview across skills by day
            const list = interview || [];
            if (list.length > 0) {
                const pickSkill = skills[(learningDay - 1) % skills.length];
                const chosen = list.find((r) => r.skill === pickSkill) || list[0];
                setInterviewQ(skills.length > 1 ? `[${chosen.skill}] ${chosen.question}` : chosen.question);
            }
            else {
                setInterviewQ("Explain a concept you learned recently and how you'd apply it.");
            }
            setLoading(false);
        })();
        return () => { active = false; };
    }, [skills, learningDay]);
    const isNewDay = user.dailyChallengeDate !== today;
    const [score, setScore] = useState(isNewDay ? 0 : user.dailyChallengeScore);
    const [completed, setCompleted] = useState(isNewDay ? [false, false, false, false, false] : [...user.dailyChallengesCompleted]);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [practiceCode, setPracticeCode] = useState("");
    const [practiceSubmitted, setPracticeSubmitted] = useState(false);
    const [explanation, setExplanation] = useState("");
    const [explanationSubmitted, setExplanationSubmitted] = useState(false);
    const [interviewAnswer, setInterviewAnswer] = useState("");
    const [interviewSubmitted, setInterviewSubmitted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    // Reset answers array when quizQuestions length changes
    useEffect(() => {
        setQuizAnswers(new Array(quizQuestions.length).fill(null));
        setQuizSubmitted(false);
    }, [quizQuestions.length]);
    const addScore = (pts, taskIndex) => {
        const newScore = score + pts;
        const newCompleted = [...completed];
        newCompleted[taskIndex] = true;
        setScore(newScore);
        setCompleted(newCompleted);
        const allDone = newCompleted.every(Boolean);
        const bonus = allDone ? 25 : 0;
        updateUser({
            dailyChallengeDate: today,
            dailyChallengeScore: newScore + bonus,
            dailyChallengesCompleted: newCompleted,
            points: user.points + pts + bonus,
        });
        if (allDone) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
            toast({ title: `Amazing ${user.username || "Champ"}! You're improving daily 🔥🚀` });
        }
    };
    const submitQuiz = () => {
        let correct = 0;
        quizQuestions.forEach((q, i) => { if (quizAnswers[i] === q.answer)
            correct++; });
        addScore(correct * 10, 0);
        setQuizSubmitted(true);
        toast({ title: `Quiz: ${correct}/${quizQuestions.length} correct! +${correct * 10} pts` });
    };
    return (_jsxs("div", { className: "min-h-screen gradient-bg relative", children: [_jsx(ParticleBackground, {}), _jsx(ProfileDropdown, {}), _jsx(Confetti, { show: showConfetti }), _jsxs("div", { className: "relative z-10 max-w-3xl mx-auto p-4 md:p-8", children: [_jsxs("button", { onClick: () => navigate("/dashboard"), className: "flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " Dashboard"] }), _jsxs("div", { className: "glass-card p-6 mb-6 text-center animate-fade-in", children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: "\uD83D\uDCC5 Daily Challenges" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [skills.join(" · "), " \u00B7 Day ", learningDay, " of 10"] }), _jsxs("div", { className: "flex justify-center gap-6 mt-3", children: [_jsxs("span", { className: "text-lg", children: ["Today's Score: ", _jsx("strong", { className: "text-primary", children: score })] }), _jsxs("span", { className: "text-lg", children: ["Total: ", _jsx("strong", { className: "text-primary", children: user.points }), " ", _jsx(Trophy, { className: "w-4 h-4 inline" })] })] })] }), loading ? (_jsxs("div", { className: "glass-card p-12 flex items-center justify-center", children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin text-primary" }), _jsx("span", { className: "ml-3 text-muted-foreground", children: "Loading today's challenges\u2026" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", children: [_jsxs("h2", { className: "font-bold text-foreground text-lg mb-4", children: ["\uD83E\uDDE0 Concept Quiz ", completed[0] && "✅"] }), quizQuestions.length === 0 && (_jsx("p", { className: "text-muted-foreground text-sm", children: "No quiz available for this skill/day yet." })), quizQuestions.map((q, qi) => (_jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "font-medium text-foreground mb-2", children: ["Q", qi + 1, ". ", q.q] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: q.options.map((opt, oi) => (_jsx("button", { disabled: quizSubmitted, onClick: () => { const a = [...quizAnswers]; a[qi] = oi; setQuizAnswers(a); }, className: `p-2 rounded-lg border text-sm transition-all text-left ${quizAnswers[qi] === oi ? "border-primary bg-primary/10" : "border-border"} ${quizSubmitted && oi === q.answer ? "border-success bg-success/10" : ""} ${quizSubmitted && quizAnswers[qi] === oi && oi !== q.answer ? "border-destructive bg-destructive/10" : ""}`, children: opt }, oi))) })] }, qi))), !quizSubmitted && quizQuestions.length > 0 && (_jsx(Button, { onClick: submitQuiz, disabled: quizAnswers.some(a => a === null), className: "w-full btn-glow", children: "Submit Quiz" }))] }), _jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", style: { animationDelay: "0.1s" }, children: [_jsxs("h2", { className: "font-bold text-foreground text-lg mb-2", children: ["\uD83D\uDCBB Mini Practice Task ", completed[1] && "✅"] }), _jsx("p", { className: "text-muted-foreground text-sm mb-3", children: "Write a small code snippet related to your current skills." }), _jsx(Textarea, { value: practiceCode, onChange: e => setPracticeCode(e.target.value), placeholder: "Write your code here...", disabled: practiceSubmitted }), !practiceSubmitted && _jsx(Button, { onClick: () => { setPracticeSubmitted(true); addScore(15, 1); toast({ title: "+15 points! 💻" }); }, disabled: !practiceCode.trim(), className: "w-full mt-3 btn-glow", children: "Submit" })] }), _jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", style: { animationDelay: "0.2s" }, children: [_jsxs("h2", { className: "font-bold text-foreground text-lg mb-2", children: ["\uD83D\uDCAC Explain What You Learned ", completed[2] && "✅"] }), _jsx(Textarea, { value: explanation, onChange: e => setExplanation(e.target.value), placeholder: "Write 2 lines about what you learned...", disabled: explanationSubmitted }), !explanationSubmitted && _jsx(Button, { onClick: () => { setExplanationSubmitted(true); addScore(10, 2); toast({ title: "+10 points! 💬" }); }, disabled: !explanation.trim(), className: "w-full mt-3 btn-glow", children: "Submit" })] }), _jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", style: { animationDelay: "0.3s" }, children: [_jsxs("h2", { className: "font-bold text-foreground text-lg mb-2", children: ["\uD83D\uDCBC Interview Question ", completed[3] && "✅"] }), _jsx("p", { className: "font-medium text-foreground mb-3", children: interviewQ }), _jsx(Textarea, { value: interviewAnswer, onChange: e => setInterviewAnswer(e.target.value), placeholder: "Your answer...", disabled: interviewSubmitted }), !interviewSubmitted && _jsx(Button, { onClick: () => { setInterviewSubmitted(true); addScore(20, 3); toast({ title: "+20 points! 💼" }); }, disabled: !interviewAnswer.trim(), className: "w-full mt-3 btn-glow", children: "Submit" })] }), _jsxs("div", { className: "glass-card p-6 mb-4 animate-slide-up", style: { animationDelay: "0.4s" }, children: [_jsxs("h2", { className: "font-bold text-foreground text-lg mb-2", children: ["\uD83D\uDD25 Consistency Challenge ", completed[4] && "✅"] }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Complete all tasks above for bonus points!" }), completed[0] && completed[1] && completed[2] && completed[3] && !completed[4] && (_jsx(Button, { onClick: () => { addScore(25, 4); toast({ title: "🔥 Consistency bonus! +25 pts!" }); }, className: "w-full mt-3 btn-glow", children: "Claim Bonus \uD83D\uDE80" })), completed[4] && _jsx("p", { className: "text-success font-bold mt-3", children: "All challenges completed! \uD83C\uDF89" })] })] }))] })] }));
};
export default DailyChallengePage;
