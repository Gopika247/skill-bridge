import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import ParticleBackground from "@/components/ParticleBackground";
import ProfileDropdown from "@/components/ProfileDropdown";
import { ArrowLeft, Download, Edit, Camera, Image as ImageIcon, FileText, Eye, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ResumePreview from "@/components/ResumePreview";
const TEMPLATES = [
    { id: "azure-executive", name: "Azure Executive", desc: "Navy sidebar · Serif", color: "#1e3a8a" },
    { id: "emerald-modern", name: "Emerald Modern", desc: "Green sidebar · Modern", color: "#065f46" },
    { id: "crimson-bold", name: "Crimson Bold", desc: "Red right · Strong", color: "#991b1b" },
    { id: "midnight-pro", name: "Midnight Pro", desc: "Slate · Corporate", color: "#0f172a" },
    { id: "sunset-creative", name: "Sunset Creative", desc: "Orange band · Warm", color: "#ea580c" },
    { id: "minimal-mono", name: "Minimal Mono", desc: "Black & white · Clean", color: "#000000" },
    { id: "tech-cyan", name: "Tech Cyan", desc: "Mono font · Developer", color: "#0e7490" },
    { id: "rose-elegant", name: "Rose Elegant", desc: "Centered · Serif", color: "#9f1239" },
    { id: "violet-creative", name: "Violet Creative", desc: "Purple sidebar · Bold", color: "#5b21b6" },
    { id: "gold-luxury", name: "Gold Luxury", desc: "Amber band · Premium", color: "#b45309" },
    { id: "teal-clean", name: "Teal Clean", desc: "Two-column · Balanced", color: "#0d9488" },
    { id: "graphite-classic", name: "Graphite Classic", desc: "Times serif · Traditional", color: "#1f2937" },
    { id: "indigo-timeline", name: "Indigo Timeline", desc: "Vertical line · Story", color: "#4f46e5" },
    { id: "olive-natural", name: "Olive Natural", desc: "Green earthy · Calm", color: "#65a30d" },
    { id: "slate-corporate", name: "Slate Corporate", desc: "Slate band · Business", color: "#475569" },
];
const FIELDS = [
    { key: "name", label: "Full Name *", placeholder: "John Doe", required: true },
    { key: "title", label: "Job Title / Role", placeholder: "Software Engineer" },
    { key: "email", label: "Email", placeholder: "john@example.com" },
    { key: "phone", label: "Phone", placeholder: "+1 555 123 4567" },
    { key: "location", label: "Location", placeholder: "New York, USA" },
    { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/johndoe" },
    { key: "website", label: "Portfolio / Website", placeholder: "johndoe.dev" },
    { key: "summary", label: "Professional Summary", placeholder: "A short 2-3 line summary about you...", multiline: true, rows: 3 },
    { key: "education", label: "Education", placeholder: "B.Tech in Computer Science\nXYZ University · 2020 - 2024 · CGPA 8.5", multiline: true, rows: 3 },
    { key: "experience", label: "Work Experience", placeholder: "Fresher? Delete this section using the 🗑 icon →", multiline: true, rows: 5 },
    { key: "projects", label: "Projects", placeholder: "E-commerce App — React, Node.js\n• 10k+ users, payment integration", multiline: true, rows: 4 },
    { key: "skills", label: "Skills (comma separated)", placeholder: "React, Node.js, Python, SQL, AWS" },
    { key: "certifications", label: "Certifications", placeholder: "AWS Certified Developer (2024)", multiline: true, rows: 2 },
    { key: "languages", label: "Languages", placeholder: "English, Spanish, French" },
    { key: "hobbies", label: "Interests / Hobbies", placeholder: "Reading, Photography, Chess" },
];
const ResumeBuilderPage = () => {
    const { user, updateUser } = useApp();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState("templates");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({});
    const [hiddenFields, setHiddenFields] = useState(new Set());
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const [downloading, setDownloading] = useState(false);
    const selectTemplate = (t) => {
        setSelectedTemplate(t);
        // Pre-fill from profile
        setFormData({
            name: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
            title: user.careerGoal || "",
            education: user.education || "",
            skills: user.knownSkills.join(", "),
        });
        setStep("form");
    };
    const updateField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
    const handlePhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Image too large", description: "Use an image under 5MB", variant: "destructive" });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setFormData(prev => ({ ...prev, photo: reader.result }));
            toast({ title: "Photo added ✅" });
        };
        reader.readAsDataURL(file);
    };
    const goPreview = () => {
        if (!formData.name?.trim()) {
            toast({ title: "Name required", description: "Please enter your full name", variant: "destructive" });
            return;
        }
        setStep("preview");
    };
    const saveAndDownload = async (mode) => {
        if (!selectedTemplate)
            return;
        setDownloading(true);
        const el = document.getElementById("resume-preview");
        if (!el) {
            setDownloading(false);
            return;
        }
        try {
            const { default: html2canvas } = await import("html2canvas");
            const canvas = await html2canvas(el, {
                scale: 1.5,
                useCORS: true,
                backgroundColor: "#ffffff",
                width: 794,
                height: 1123,
                windowWidth: 794,
                windowHeight: 1123,
                scrollX: 0,
                scrollY: 0,
                logging: false,
            });
            const filename = `${(formData.name || "Resume").replace(/\s+/g, "_")}_${selectedTemplate.id}`;
            if (mode === "png") {
                const link = document.createElement("a");
                link.download = `${filename}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            }
            else {
                const { default: jsPDF } = await import("jspdf");
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
                const pdfW = pdf.internal.pageSize.getWidth();
                const pdfH = pdf.internal.pageSize.getHeight();
                const imgH = (canvas.height * pdfW) / canvas.width;
                let position = 0;
                let heightLeft = imgH;
                pdf.addImage(imgData, "PNG", 0, position, pdfW, imgH);
                heightLeft -= pdfH;
                while (heightLeft > 0) {
                    position = heightLeft - imgH;
                    pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, position, pdfW, imgH);
                    heightLeft -= pdfH;
                }
                pdf.save(`${filename}.pdf`);
            }
            // Save to history
            const newResume = {
                id: Date.now().toString(),
                name: `${formData.name || "Resume"} · ${selectedTemplate.name}`,
                template: selectedTemplate.id,
                date: new Date().toLocaleDateString(),
                data: formData,
            };
            updateUser({ resumes: [...user.resumes, newResume] });
            toast({ title: `Resume downloaded! 📥`, description: `Saved as ${mode.toUpperCase()}` });
        }
        catch (err) {
            toast({ title: "Download failed", description: "Please try again", variant: "destructive" });
        }
        setDownloading(false);
    };
    return (_jsxs("div", { className: "min-h-screen gradient-bg relative", children: [_jsx(ParticleBackground, {}), _jsx(ProfileDropdown, {}), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: handlePhoto }), _jsx("input", { ref: cameraInputRef, type: "file", accept: "image/*", capture: "user", className: "hidden", onChange: handlePhoto }), _jsxs("div", { className: "relative z-10 max-w-6xl mx-auto p-4 md:p-8", children: [_jsxs("button", { onClick: () => (step === "templates" || step === "history" ? navigate("/dashboard") : setStep(step === "preview" ? "form" : "templates")), className: "flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " ", step === "templates" || step === "history" ? "Dashboard" : "Back"] }), _jsxs("div", { className: "flex gap-3 mb-6", children: [_jsx("button", { onClick: () => setStep("templates"), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${step !== "history" ? "bg-primary text-primary-foreground" : "glass-card text-foreground hover:bg-secondary"}`, children: "\uD83D\uDCDD New Resume" }), _jsxs("button", { onClick: () => setStep("history"), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${step === "history" ? "bg-primary text-primary-foreground" : "glass-card text-foreground hover:bg-secondary"}`, children: ["\uD83D\uDD58 History (", user.resumes.length, ")"] })] }), step === "templates" && (_jsxs("div", { className: "animate-fade-in", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold text-foreground mb-2", children: "Choose a Template" }), _jsx("p", { className: "text-muted-foreground mb-6 text-sm", children: "15 professional designs \u2014 pick one and start filling in details" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5", children: TEMPLATES.map(t => {
                                    const layoutType = ["azure-executive", "emerald-modern", "midnight-pro", "olive-natural"].includes(t.id) ? "sidebar-left"
                                        : ["crimson-bold", "violet-creative"].includes(t.id) ? "sidebar-right"
                                            : ["sunset-creative", "gold-luxury", "slate-corporate"].includes(t.id) ? "header-band"
                                                : ["rose-elegant"].includes(t.id) ? "centered"
                                                    : ["indigo-timeline"].includes(t.id) ? "timeline"
                                                        : ["tech-cyan", "teal-clean"].includes(t.id) ? "two-column"
                                                            : "minimal";
                                    return (_jsxs("div", { onClick: () => selectTemplate(t), className: "glass-card-hover cursor-pointer overflow-hidden group rounded-xl", children: [_jsxs("div", { className: "aspect-[3/4] relative overflow-hidden bg-white", children: [_jsxs("div", { className: "absolute inset-0 flex", style: { fontSize: "4px" }, children: [layoutType === "sidebar-left" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "w-[35%] p-2 flex flex-col items-center", style: { background: t.color, color: "#fff" }, children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-white/30 mb-1.5" }), _jsx("div", { className: "h-1 w-full bg-white/70 mb-0.5 rounded-sm" }), _jsx("div", { className: "h-0.5 w-3/4 bg-white/50 mb-2 rounded-sm" }), _jsx("div", { className: "w-full space-y-0.5 mb-2", children: [...Array(4)].map((_, i) => _jsx("div", { className: "h-0.5 bg-white/40 rounded-sm" }, i)) }), _jsx("div", { className: "h-1 w-1/2 bg-white/70 mb-0.5 rounded-sm" }), _jsx("div", { className: "w-full flex flex-wrap gap-0.5", children: [...Array(6)].map((_, i) => _jsx("div", { className: "h-1 w-2.5 bg-white/40 rounded-full" }, i)) })] }), _jsxs("div", { className: "flex-1 p-2 space-y-1.5", children: [_jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(4)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) })] })] })), layoutType === "sidebar-right" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-1 p-2 space-y-1.5", children: [_jsx("div", { className: "h-1.5 w-1/2 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "h-0.5 w-1/3 bg-gray-400 rounded-sm mb-1" }), _jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(4)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) })] }), _jsxs("div", { className: "w-[35%] p-2 flex flex-col items-center", style: { background: t.color, color: "#fff" }, children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-white/30 mb-1.5" }), _jsx("div", { className: "h-1 w-full bg-white/70 mb-0.5 rounded-sm" }), _jsx("div", { className: "w-full space-y-0.5 mb-2", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-white/40 rounded-sm" }, i)) }), _jsx("div", { className: "w-full flex flex-wrap gap-0.5", children: [...Array(5)].map((_, i) => _jsx("div", { className: "h-1 w-2.5 bg-white/40 rounded-full" }, i)) })] })] })), layoutType === "header-band" && (_jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "p-2 flex items-center gap-1.5", style: { background: t.color, color: "#fff" }, children: [_jsx("div", { className: "w-5 h-5 rounded-full bg-white/30" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "h-1 w-3/4 bg-white/80 rounded-sm mb-0.5" }), _jsx("div", { className: "h-0.5 w-1/2 bg-white/50 rounded-sm" })] })] }), _jsxs("div", { className: "flex-1 p-2 space-y-1.5", children: [_jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(4)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "flex flex-wrap gap-0.5 mt-1", children: [...Array(6)].map((_, i) => _jsx("div", { className: "h-1 w-3 rounded-full", style: { background: t.color, opacity: 0.5 } }, i)) })] })] })), layoutType === "centered" && (_jsxs("div", { className: "flex-1 p-2 flex flex-col items-center", children: [_jsx("div", { className: "w-7 h-7 rounded-full mb-1", style: { background: t.color, opacity: 0.3 } }), _jsx("div", { className: "h-1.5 w-2/3 rounded-sm mb-0.5", style: { background: t.color } }), _jsx("div", { className: "h-0.5 w-1/3 bg-gray-400 rounded-sm mb-1" }), _jsx("div", { className: "h-px w-1/4 mb-1.5", style: { background: t.color } }), _jsxs("div", { className: "w-full space-y-1.5", children: [_jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) })] })] })), layoutType === "two-column" && (_jsxs("div", { className: "flex-1 p-2 flex flex-col", children: [_jsxs("div", { className: "pb-1 mb-1.5 border-b-2", style: { borderColor: t.color }, children: [_jsx("div", { className: "h-1.5 w-1/2 rounded-sm mb-0.5", style: { background: t.color } }), _jsx("div", { className: "h-0.5 w-1/3 bg-gray-400 rounded-sm" })] }), _jsxs("div", { className: "flex-1 grid grid-cols-[1.6fr_1fr] gap-1.5", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "h-1 w-1/2 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "h-1 w-1/2 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "h-1 w-3/4 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "flex flex-wrap gap-0.5", children: [...Array(5)].map((_, i) => _jsx("div", { className: "h-1 w-2.5 rounded-full", style: { background: t.color, opacity: 0.5 } }, i)) })] })] })] })), layoutType === "timeline" && (_jsxs("div", { className: "flex-1 p-2", children: [_jsxs("div", { className: "pl-1.5 border-l-2 mb-2", style: { borderColor: t.color }, children: [_jsx("div", { className: "h-1.5 w-1/2 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "h-0.5 w-1/3 bg-gray-400 rounded-sm mt-0.5" })] }), _jsx("div", { className: "space-y-1.5", children: [...Array(3)].map((_, i) => (_jsxs("div", { className: "pl-1.5 border-l-2", style: { borderColor: t.color, opacity: 0.6 }, children: [_jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "h-0.5 w-3/4 bg-gray-300 rounded-sm mt-0.5" }), _jsx("div", { className: "h-0.5 w-2/3 bg-gray-300 rounded-sm mt-0.5" })] }, i))) })] })), layoutType === "minimal" && (_jsxs("div", { className: "flex-1 p-2.5", children: [_jsxs("div", { className: "pb-1 mb-1.5 border-b-2", style: { borderColor: t.color }, children: [_jsx("div", { className: "h-2 w-2/3 rounded-sm mb-0.5", style: { background: t.color } }), _jsx("div", { className: "h-0.5 w-1/3 bg-gray-500 rounded-sm" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(3)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "h-1 w-1/3 rounded-sm", style: { background: t.color } }), _jsx("div", { className: "space-y-0.5", children: [...Array(4)].map((_, i) => _jsx("div", { className: "h-0.5 bg-gray-300 rounded-sm" }, i)) }), _jsx("div", { className: "flex flex-wrap gap-0.5 mt-1", children: [...Array(5)].map((_, i) => _jsx("div", { className: "h-1 w-3 rounded-full", style: { background: t.color, opacity: 0.4 } }, i)) })] })] }))] }), _jsx("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: _jsxs("span", { className: "text-white text-xs font-semibold flex items-center gap-1.5 bg-primary px-3 py-2 rounded-full shadow-lg", children: [_jsx(Eye, { className: "w-3.5 h-3.5" }), " Use Template"] }) })] }), _jsxs("div", { className: "p-3 border-t border-border", children: [_jsx("p", { className: "font-semibold text-foreground text-sm truncate", children: t.name }), _jsx("p", { className: "text-muted-foreground text-xs truncate", children: t.desc })] })] }, t.id));
                                }) })] })), step === "form" && selectedTemplate && (_jsxs("div", { className: "animate-fade-in grid lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "glass-card p-5 md:p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 pb-3 border-b border-border", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-bold text-foreground", children: "Fill Your Details" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Template: ", _jsx("span", { className: "font-medium", style: { color: selectedTemplate.color }, children: selectedTemplate.name })] })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setStep("templates"), children: "Change" })] }), _jsxs("div", { className: "flex items-center gap-3 mb-5 pb-4 border-b border-border", children: [formData.photo ? (_jsx("img", { src: formData.photo, className: "w-16 h-16 rounded-full object-cover border-2 border-primary", alt: "" })) : (_jsx("div", { className: "w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl", children: "\uD83D\uDC64" })), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { size: "sm", variant: "outline", onClick: () => fileInputRef.current?.click(), className: "gap-1", children: [_jsx(ImageIcon, { className: "w-3 h-3" }), " Upload"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => cameraInputRef.current?.click(), className: "gap-1", children: [_jsx(Camera, { className: "w-3 h-3" }), " Camera"] }), formData.photo && (_jsx(Button, { size: "sm", variant: "ghost", onClick: () => updateField("photo", ""), children: "Remove" }))] })] }), _jsxs("div", { className: "space-y-3 max-h-[60vh] overflow-y-auto pr-2", children: [FIELDS.map(f => {
                                                if (hiddenFields.has(f.key))
                                                    return null;
                                                return (_jsxs("div", { className: "group", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx(Label, { htmlFor: f.key, className: "text-xs font-medium", children: f.label }), !f.required && (_jsx("button", { type: "button", onClick: () => {
                                                                        setHiddenFields(prev => new Set(prev).add(f.key));
                                                                        setFormData(prev => ({ ...prev, [f.key]: "" }));
                                                                    }, className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1", title: "Remove this section", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) }))] }), f.multiline ? (_jsx(Textarea, { id: f.key, placeholder: f.placeholder, value: formData[f.key] || "", onChange: e => updateField(f.key, e.target.value), rows: f.rows || 3, className: "text-sm" })) : (_jsx(Input, { id: f.key, placeholder: f.placeholder, value: formData[f.key] || "", onChange: e => updateField(f.key, e.target.value), className: "text-sm" }))] }, f.key));
                                            }), hiddenFields.size > 0 && (_jsxs("div", { className: "pt-3 mt-3 border-t border-border", children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Removed sections \u2014 click to restore:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: [...hiddenFields].map(key => {
                                                            const f = FIELDS.find(x => x.key === key);
                                                            if (!f)
                                                                return null;
                                                            return (_jsxs("button", { type: "button", onClick: () => setHiddenFields(prev => { const n = new Set(prev); n.delete(key); return n; }), className: "text-xs px-2.5 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground transition-colors flex items-center gap-1", children: [_jsx(Plus, { className: "w-3 h-3" }), " ", f.label.replace(" *", "")] }, key));
                                                        }) })] }))] }), _jsxs(Button, { onClick: goPreview, className: "w-full btn-glow mt-5 gap-2", children: [_jsx(Eye, { className: "w-4 h-4" }), " Preview Resume"] })] }), _jsxs("div", { className: "hidden lg:block sticky top-6 self-start", children: [_jsx("p", { className: "text-xs text-muted-foreground mb-2 font-medium", children: "Live Preview" }), _jsx("div", { className: "rounded-xl overflow-hidden shadow-2xl bg-white", style: {
                                            transform: "scale(0.5)",
                                            transformOrigin: "top left",
                                            width: "794px",
                                            height: "1123px",
                                            overflow: "hidden",
                                        }, children: _jsx(ResumePreview, { templateId: selectedTemplate.id, templateName: selectedTemplate.name, resumeData: formData, user: user, hiddenFields: hiddenFields }) })] })] })), step === "preview" && selectedTemplate && (_jsx("div", { className: "animate-fade-in", children: _jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-bold text-foreground", children: "Your Resume" }), _jsx("span", { className: "text-xs text-muted-foreground", children: selectedTemplate.name })] }), _jsx("div", { id: "resume-preview", className: "overflow-hidden rounded-xl mb-4 shadow-2xl bg-white", style: {
                                        width: "794px",
                                        height: "1123px",
                                        overflow: "hidden",
                                        pageBreakInside: "avoid",
                                    }, children: _jsx(ResumePreview, { templateId: selectedTemplate.id, templateName: selectedTemplate.name, resumeData: formData, user: user, hiddenFields: hiddenFields }) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs(Button, { onClick: () => setStep("form"), variant: "outline", className: "gap-2", children: [_jsx(Edit, { className: "w-4 h-4" }), " Edit"] }), _jsxs(Button, { onClick: () => saveAndDownload("png"), variant: "outline", disabled: downloading, className: "gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), " PNG"] }), _jsxs(Button, { onClick: () => saveAndDownload("pdf"), disabled: downloading, className: "btn-glow gap-2", children: [_jsx(FileText, { className: "w-4 h-4" }), " ", downloading ? "Generating..." : "Download PDF"] })] })] }) })), step === "history" && (_jsxs("div", { className: "animate-fade-in", children: [_jsx("h1", { className: "text-2xl font-bold text-foreground mb-6", children: "\uD83D\uDD58 Resume History" }), user.resumes.length === 0 ? (_jsxs("div", { className: "glass-card p-8 text-center", children: [_jsx("p", { className: "text-muted-foreground mb-4", children: "No resumes yet. Create your first one!" }), _jsx(Button, { onClick: () => setStep("templates"), className: "btn-glow", children: "Create Resume" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: user.resumes.map(r => {
                                    const t = TEMPLATES.find(t => t.id === r.template);
                                    return (_jsx("div", { className: "glass-card p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-2 h-12 rounded-full", style: { backgroundColor: t?.color || "#888" } }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-foreground", children: r.name }), _jsxs("p", { className: "text-muted-foreground text-xs", children: [r.date, " \u00B7 ", t?.name || r.template] }), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                                                                        if (t) {
                                                                            setSelectedTemplate(t);
                                                                            setFormData(r.data);
                                                                            setStep("preview");
                                                                        }
                                                                    }, children: "View" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                                                                        if (t) {
                                                                            setSelectedTemplate(t);
                                                                            setFormData(r.data);
                                                                            setStep("form");
                                                                        }
                                                                    }, children: "Edit" })] })] })] }) }, r.id));
                                }) }))] }))] })] }));
};
export default ResumeBuilderPage;
