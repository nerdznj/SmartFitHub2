import { motion, HTMLMotionProps } from 'framer-motion';

interface Props extends HTMLMotionProps<"button"> {
  variant?: 'cyan' | 'green' | 'orange';
}

export const NeonButton = ({ children, variant = 'cyan', className = '', ...props }: Props) => {
  const colors = {
    cyan: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]',
    green: 'border-neon-green text-neon-green hover:bg-neon-green/10 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]',
    orange: 'border-neon-orange text-neon-orange hover:bg-neon-orange/10 hover:shadow-[0_0_20px_rgba(255,158,0,0.4)]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3 px-6 rounded-lg border font-orbitron font-bold tracking-wider transition-all duration-300 ${colors[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};