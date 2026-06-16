import { motion } from "motion/react";

interface AnimatedArrowProps {
  size?: number;
  isHovered: boolean;
}

/**
 * Diagonal spring arrow — primary exits top-right on hover, ghost enters from
 * bottom-left. Shared by PillButton and PostCard so the motion is identical.
 */
export function AnimatedArrow({ size = 16, isHovered }: AnimatedArrowProps) {
  return (
    <span
      className="relative overflow-hidden"
      style={{ width: size, height: size, display: "inline-block" }}
      aria-hidden
    >
      {/* Primary arrow — exits top-right */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          idle: { x: 0, y: 0, opacity: 1 },
          hovered: { x: size * 0.6, y: -size * 0.6, opacity: 0 },
        }}
        initial="idle"
        animate={isHovered ? "hovered" : "idle"}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <ArrowSvg size={size} />
      </motion.span>

      {/* Ghost arrow — enters from bottom-left */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          idle: { x: -size * 0.6, y: size * 0.6, opacity: 0 },
          hovered: { x: 0, y: 0, opacity: 1 },
        }}
        initial="idle"
        animate={isHovered ? "hovered" : "idle"}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <ArrowSvg size={size} />
      </motion.span>
    </span>
  );
}

function ArrowSvg({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      role="presentation"
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
