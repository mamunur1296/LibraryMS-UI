import React from 'react';
import { motion } from 'motion/react';
import { Library } from 'lucide-react';

interface AuthBrandingPanelProps {
  title: string;
  highlight: string;
  description: string;
  children?: React.ReactNode;
}

export function AuthBrandingPanel({ title, highlight, description, children }: AuthBrandingPanelProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-blue-400 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-500 rounded-xl">
            <Library className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">LibraryMS</span>
        </div>
        <p className="text-navy-300 text-sm">Library Management System</p>
      </div>

      <div className="relative z-10 space-y-6">
        <div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            {title}
            <span className="block text-amber-400">{highlight}</span>
          </h1>
          <p className="mt-4 text-lg text-navy-300 max-w-md leading-relaxed">
            {description}
          </p>
        </div>
        {children}
      </div>

      <p className="relative z-10 text-navy-500 text-xs">
        © {new Date().getFullYear()} LibraryMS. All rights reserved.
      </p>
    </motion.div>
  );
}
