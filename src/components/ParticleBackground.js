import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
const ParticleBackground = () => {
    const [particles] = useState(() => Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 20,
        size: 2 + Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.4,
    })));
    return (_jsx("div", { className: "fixed inset-0 overflow-hidden pointer-events-none z-0", children: particles.map(p => (_jsx("div", { className: "absolute rounded-full bg-primary/30", style: {
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
            } }, p.id))) }));
};
export default ParticleBackground;
