// Animation configuration constants
export const TRANSITION_NORMAL = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
export const TRANSITION_FAST = { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }
export const TRANSITION_BOUNCE = {
  type: "spring",
  stiffness: 260,
  damping: 20,
}

// Staggered children animation delay
export const STAGGER_CHILDREN = {
  staggerChildren: 0.1,
  delayChildren: 0.1,
}

// Animation variants for various components
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION_NORMAL },
}

export const slideInFromBottom = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: TRANSITION_NORMAL },
}

export const slideInFromTop = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: TRANSITION_NORMAL },
}

export const slideInFromLeft = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: TRANSITION_NORMAL },
}

export const slideInFromRight = {
  hidden: { x: 30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: TRANSITION_NORMAL },
}

export const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: TRANSITION_NORMAL },
}

export const listAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: STAGGER_CHILDREN,
  },
}

export const listItemAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_NORMAL },
}

// Hover animations
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 },
}

export const cardHover = {
  y: -5,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  transition: { duration: 0.3 },
}
