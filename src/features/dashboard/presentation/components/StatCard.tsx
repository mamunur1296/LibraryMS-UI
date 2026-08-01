import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { Card } from '@shared/ui';

export interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  change?: string;
}

export function StatCard({ stat }: { stat: StatItem }): React.ReactElement {
  const Icon = stat.icon;
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card padding="md" className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${stat.bgColor} shrink-0`}>
          <Icon className={`h-6 w-6 ${stat.color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">{stat.value}</p>
          {stat.change !== undefined && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
