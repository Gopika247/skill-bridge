import { jsx as _jsx } from "react/jsx-runtime";
import aiRobotImg from "@/assets/ai-robot.png";
const AIRobot = ({ size = "lg", animate = true }) => {
    const s = size === "lg" ? 180 : size === "md" ? 80 : 50;
    return (_jsx("div", { className: animate ? "animate-float" : "", style: { width: s, height: s }, children: _jsx("img", { src: aiRobotImg, alt: "AI Mentor Robot", width: s, height: s, className: "w-full h-full object-contain" }) }));
};
export default AIRobot;
