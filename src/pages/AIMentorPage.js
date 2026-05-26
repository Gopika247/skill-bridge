import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import ParticleBackground from "@/components/ParticleBackground";
import ProfileDropdown from "@/components/ProfileDropdown";
import AIRobot from "@/components/AIRobot";
import { ArrowLeft, Send, Plus, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
const CHAT_URL = "https://yfsurrorbdpxfxzufzxz.supabase.co/functions/v1/aimentor";
const ANON_KEY = "sb_publishable_dnyUni7fNeI8DG5oXNRDLg_VHbtrAZa";
const AIMentorPage = () => {
    const { user, authUser } = useApp(); // authUser use pannuna extra safety
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [currentConv, setCurrentConv] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const scrollRef = useRef(null);
    const suggestions = [
        "How to start DSA?",
        "Give me a React roadmap",
        "Explain JavaScript closures",
        "Mock interview question please",
    ];
    // 🛡️ Load Conversations - Fixed logic
    const loadConversations = async () => {
        const currentUserId = authUser?.id || (user?.isLoggedIn ? user.id : null);
        if (!currentUserId)
            return;
        const { data, error } = await supabase
            .from("conversations")
            .select("*")
            .eq("user_id", currentUserId)
            .order("created_at", { ascending: false });
        if (!error)
            setConversations(data || []);
    };
    useEffect(() => {
        if (authUser?.id || user?.isLoggedIn) {
            loadConversations();
        }
    }, [authUser, user?.isLoggedIn]);
    // 📂 Load Existing Chat
    const loadChat = async (id) => {
        setCurrentConv(id);
        const { data } = await supabase
            .from("chats")
            .select("*")
            .eq("conversation_id", id)
            .order("created_at", { ascending: true });
        const formatted = data?.flatMap((c) => [
            { role: "user", content: c.message },
            { role: "assistant", content: c.response },
        ]) || [];
        setMessages(formatted);
        setShowSidebar(false);
    };
    const send = async (text) => {
        const finalInput = text || input;
        const currentUserId = authUser?.id;
        if (!finalInput.trim() || isLoading || !currentUserId)
            return;
        let convId = currentConv;
        setMessages((prev) => [...prev, { role: "user", content: finalInput }]);
        setInput("");
        setIsLoading(true);
        try {
            if (!convId) {
                const { data: newConv } = await supabase
                    .from("conversations")
                    .insert([{ user_id: currentUserId, title: finalInput.slice(0, 30) }])
                    .select().single();
                if (newConv) {
                    convId = newConv.id;
                    setCurrentConv(convId);
                }
            }
            const resp = await fetch(CHAT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON_KEY}` },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: finalInput }],
                    context: { username: user.username, skillLevel: user.skillLevel }
                }),
            });
            const result = await resp.json();
            const aiText = result.choices?.[0]?.message?.content || "No response";
            setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
            // ✅ Insert into chats
            await supabase.from("chats").insert([{
                    user_id: currentUserId,
                    conversation_id: convId,
                    message: finalInput,
                    response: aiText,
                }]);
            loadConversations();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Blank page fix: loading check
    if (!authUser && !user?.isLoggedIn) {
        return _jsx("div", { className: "h-screen w-full bg-[#0B0E14] flex items-center justify-center text-white", children: "Loading Mentor..." });
    }
    return (_jsxs("div", { className: "flex h-screen w-full overflow-hidden bg-[#0B0E14] relative", children: [_jsx("div", { className: "fixed inset-0 z-0 pointer-events-none opacity-40", children: _jsx(ParticleBackground, {}) }), _jsx("aside", { className: `fixed inset-y-0 left-0 z-[100] w-80 bg-black/80 backdrop-blur-3xl border-r border-white/10 transition-transform duration-300 md:relative md:translate-x-0 ${showSidebar ? "translate-x-0" : "-translate-x-full"}`, children: _jsxs("div", { className: "p-4 flex flex-col h-full relative z-[110]", children: [_jsxs(Button, { onClick: () => { setMessages([]); setCurrentConv(null); }, className: "w-full mb-6 py-6 gap-2 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-white rounded-xl cursor-pointer", children: [_jsx(Plus, { size: 20 }), " ", _jsx("span", { className: "font-bold", children: "New Chat" })] }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-2", children: conversations.map((c) => (_jsx("div", { onClick: () => loadChat(c.id), className: `p-4 rounded-xl cursor-pointer transition-all border ${currentConv === c.id ? "bg-primary/20 border-primary" : "bg-white/5 border-transparent hover:bg-white/10"} text-muted-foreground hover:text-white`, children: _jsx("span", { className: "truncate block text-sm", children: c.title }) }, c.id))) })] }) }), _jsxs("main", { className: "flex-1 flex flex-col relative z-20 w-full min-w-0 h-full", children: [_jsx("div", { className: "relative z-[150]", children: _jsx(ProfileDropdown, {}) }), _jsxs("header", { className: "flex items-center gap-3 p-4 border-b border-white/5 bg-background/50 backdrop-blur-md relative z-[100]", children: [_jsx("button", { className: "md:hidden p-2", onClick: () => setShowSidebar(!showSidebar), children: _jsx(Menu, { size: 22 }) }), _jsx("button", { onClick: () => navigate("/dashboard"), className: "p-2", children: _jsx(ArrowLeft, { size: 22 }) }), _jsx(AIRobot, { size: "sm", animate: isLoading }), _jsxs("div", { children: [_jsx("h1", { className: "font-bold text-base", children: user.mentorName || "Nova" }), _jsx("p", { className: "text-[10px] text-green-500 font-bold uppercase", children: "Online" })] })] }), _jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col relative z-50", children: [messages.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center flex-1 text-center space-y-4", children: [_jsx(AIRobot, { size: "lg" }), _jsxs("h2", { className: "text-2xl font-bold", children: ["Hey ", user.username, "!"] }), _jsxs("p", { className: "text-muted-foreground text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed", children: ["I'm ", _jsx("span", { className: "text-white", children: user.mentorName || "Nova" }), ", your personal learning partner. Let's build something amazing today!"] })] })), messages.map((msg, i) => (_jsx("div", { className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`, children: _jsx("div", { className: `max-w-[80%] px-5 py-3.5 rounded-2xl text-sm border shadow-xl ${msg.role === "user" ? "bg-primary text-white" : "bg-[#1A1F26] text-white border-white/10"}`, children: _jsx(ReactMarkdown, { children: msg.content }) }) }, i)))] }), _jsxs("div", { className: "p-4 md:p-6 bg-gradient-to-t from-[#0B0E14] to-transparent relative z-[120]", children: [messages.length === 0 && (_jsx("div", { className: "flex flex-wrap justify-center gap-2 max-w-4xl mx-auto mb-6", children: suggestions.map((s, i) => (_jsx("button", { onClick: () => send(s), className: "px-4 py-2 text-xs bg-white/10 hover:bg-primary/30 border border-white/10 rounded-full cursor-pointer", children: s }, i))) })), _jsxs("div", { className: "max-w-4xl mx-auto flex gap-2 items-center bg-[#161B22] px-4 py-2.5 rounded-2xl border border-white/10 relative z-[130]", children: [_jsx(Input, { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && send(), placeholder: "Message Nova...", className: "flex-1 bg-transparent border-none text-white focus-visible:ring-0" }), _jsx(Button, { onClick: () => send(), disabled: isLoading || !input.trim(), size: "icon", className: "bg-primary cursor-pointer", children: _jsx(Send, { className: "w-4 h-4 text-white" }) })] })] })] })] }));
};
export default AIMentorPage;
