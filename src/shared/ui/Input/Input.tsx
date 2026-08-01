import React from 'react';
import { cn } from '@shared/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftElement, rightElement, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label !== undefined && label !== '' && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 select-none">
            {label}
            {props.required === true && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement !== undefined && (
            <span className="absolute left-3 text-slate-400 pointer-events-none">
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border bg-white text-slate-900 placeholder:text-slate-400',
              'text-sm h-10 px-3',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
              error !== undefined && error !== ''
                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                : 'border-slate-200 hover:border-slate-300',
              leftElement !== undefined ? 'pl-10' : '',
              rightElement !== undefined ? 'pr-10' : '',
              className,
            )}
            {...props}
          />
          {rightElement !== undefined && (
            <span className="absolute right-3 text-slate-400">{rightElement}</span>
          )}
        </div>
        {error !== undefined && error !== '' && (
          <p className="text-xs text-red-500 mt-0.5">{error}</p>
        )}
        {hint !== undefined && hint !== '' && error === undefined && (
          <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
