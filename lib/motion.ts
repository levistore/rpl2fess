import type { Transition, Variants } from "motion/react";

/**
 * Standardized easing curve for RPLTwoFess motion.
 * Clean, cinematic cubic bezier without overshooting bounce or spring.
 */
export const EASE_NATURAL = [0.16, 1, 0.3, 1] as const;

/** Standard durations in seconds */
export const DURATION = {
  micro: 0.15,
  standard: 0.25,
  reveal: 0.5,
  page: 0.25,
} as const;

/** Standard transitions */
export const transitions = {
  micro: {
    duration: DURATION.micro,
    ease: EASE_NATURAL,
  } satisfies Transition,
  standard: {
    duration: DURATION.standard,
    ease: EASE_NATURAL,
  } satisfies Transition,
  reveal: {
    duration: DURATION.reveal,
    ease: EASE_NATURAL,
  } satisfies Transition,
};

/** Reusable motion variants */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.standard,
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.reveal,
  },
};

export const slideUpSm: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.standard,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.standard,
  },
};

export const staggerContainer = (
  staggerChildren = 0.06,
  delayChildren = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.reveal,
  },
};
