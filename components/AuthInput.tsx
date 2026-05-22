import {
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: ReactNode;
  error?: string;
  showPasswordToggle?: boolean;
  wrapperClassName?: string;
}

export default function AuthInput({
  label,
  name,
  icon,
  error,
  showPasswordToggle = false,
  type,
  wrapperClassName = '',
  className = '',
  ...rest
}: AuthInputProps) {
  const [internalType, setInternalType] = useState(type);
  const isPassword = showPasswordToggle && type === 'password';

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      <label
        htmlFor={name}
        className="text-xs font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400 select-none"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={internalType}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          placeholder=" "
          className={`
            peer h-12 w-full rounded-xl
            border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800
            px-4 text-sm text-gray-900 dark:text-gray-100
            placeholder-transparent
            transition-all duration-200 ease-out
            hover:border-gray-300 dark:hover:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-violet-500/20
            focus:border-violet-500 focus:bg-white dark:focus:bg-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...rest}
        />

        {/* Floating label */}
        <label
          htmlFor={name}
          className="
            pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2
            text-sm text-gray-400 dark:text-gray-500
            transition-all duration-200 ease-out
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-0 peer-focus:left-2.5
            peer-focus:text-violet-500 peer-focus:font-medium
            peer-[&:not(:placeholder-shown)]:top-2
            peer-[&:not(:placeholder-shown)]:scale-75
            peer-[&:not(:placeholder-shown)]:-translate-y-0
            peer-[&:not(:placeholder-shown)]:left-2.5
            peer-[&:not(:placeholder-shown)]:text-gray-900
            peer-[&:not(:placeholder-shown)]:dark:text-gray-100
            peer-[&:not(:placeholder-shown)]:font-medium
            rtl:left-auto rtl:right-3.5
            rtl:peer-focus:right-2.5
            rtl:peer-[&:not(:placeholder-shown)]:right-2.5
          "
          style={{ transformOrigin: 'left center' }}
        >
          {label}
        </label>

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() =>
              setInternalType((prev) =>
                prev === 'password' ? 'text' : 'password',
              )
            }
            className="
              absolute right-3.5 top-1/2 -translate-y-1/2
              text-gray-400 dark:text-gray-500
              hover:text-gray-600 dark:hover:text-gray-300
              transition-colors duration-150
              focus:outline-none
            "
            aria-label={internalType === 'password' ? 'Show password' : 'Hide password'}
          >
            {internalType === 'password' ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 animate-[slideDown_0.2s_ease-out]"
        >
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
