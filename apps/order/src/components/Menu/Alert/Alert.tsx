import { motion } from "framer-motion";
import React from "react";

export default function Alert({
  title,
  Icon,
}: {
  title: string;
  Icon?: React.ReactNode;
}) {
  return (
    <motion.div
      className="fixed right-1/2 z-50 min-w-max translate-x-1/2 rounded-2xl bg-[#313638] px-10 py-5"
      initial={{ translateX: "50%", opacity: 0, scale: "1" }}
      animate={{ top: "76vh", scale: "1.1", opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        ease: "easeOut",
      }}
    >
      <div className="inline-flex w-auto items-center justify-center gap-4">
        {Icon}
        <p className="text-[20px] font-semibold text-white1">{title}</p>
      </div>
    </motion.div>
  );
}
