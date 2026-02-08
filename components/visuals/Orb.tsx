"use client";
import { motion } from "framer-motion";

export function Orb() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Outer Glow Pulse */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-eter-cyan/20 blur-[80px]"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

       {/* Secondary Aura */}
       <motion.div
        className="absolute w-48 h-48 rounded-full bg-eter-purple/20 blur-[60px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {/* Core Orb Ring */}
      <motion.div
        className="relative w-32 h-32 rounded-full border border-eter-cyan/50"
        style={{
            background: "radial-gradient(circle at center, rgba(0,240,255,0.1) 0%, rgba(0,0,0,0) 70%)"
        }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 240, 255, 0.1)",
            "0 0 50px rgba(0, 240, 255, 0.4)",
            "0 0 20px rgba(0, 240, 255, 0.1)"
          ],
          borderColor: [
            "rgba(0, 240, 255, 0.3)",
            "rgba(0, 240, 255, 0.8)",
            "rgba(0, 240, 255, 0.3)"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner Core */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[1px]" />
        
        {/* Rotating Segment */}
        <motion.div 
            className="absolute inset-[-2px] rounded-full border-t border-r border-eter-cyan/80 border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}
