import type { HabitId } from '../types';

interface HabitIconProps {
  habit: HabitId;
  size?: number;
  className?: string;
}

export function HabitIcon({ habit, size = 44, className = '' }: HabitIconProps) {
  switch (habit) {
    case 'understand':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect width="48" height="48" rx="14" fill="#E6F2F2" />
          <path
            d="M11 16C11 13.7909 12.7909 12 15 12H33C35.2091 12 37 13.7909 37 16V27C37 29.2091 35.2091 31 33 31H21L14 36V31H15C12.7909 31 11 29.2091 11 27V16Z"
            fill="#0F5C61"
          />
          <path
            d="M24 25.8C24 25.8 18.8 22.6 18.8 19.2C18.8 17.5 20.1 16.3 21.6 16.3C22.6 16.3 23.5 16.8 24 17.6C24.5 16.8 25.4 16.3 26.4 16.3C27.9 16.3 29.2 17.5 29.2 19.2C29.2 22.6 24 25.8 24 25.8Z"
            fill="#A3E635"
          />
        </svg>
      );

    case 'investigate':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect width="48" height="48" rx="14" fill="#ECFCCB" />
          <rect x="10" y="13" width="22" height="17" rx="3.5" fill="#0F5C61" />
          <path d="M10 17.5H32" stroke="#A3E635" strokeWidth="2" />
          <circle cx="13.5" cy="15.2" r="1" fill="#FAF7F2" />
          <circle cx="16.5" cy="15.2" r="1" fill="#FAF7F2" />
          <rect x="14" y="21" width="9" height="2" rx="1" fill="#FAF7F2" opacity="0.85" />
          <rect x="14" y="25" width="6" height="2" rx="1" fill="#FAF7F2" opacity="0.6" />
          <circle
            cx="29.5"
            cy="27.5"
            r="6.5"
            fill="#FAF7F2"
            stroke="#072C2F"
            strokeWidth="2.4"
          />
          <path
            d="M34.2 32.2L38.5 36.5"
            stroke="#072C2F"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="29.5" cy="27.5" r="2.6" fill="#84CC16" />
        </svg>
      );

    case 'ownership':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect width="48" height="48" rx="14" fill="#E6F2F2" />
          <circle cx="24" cy="24" r="12" fill="#0F5C61" />
          <circle cx="24" cy="24" r="8.5" stroke="#FAF7F2" strokeWidth="1.5" strokeDasharray="2.5 2.5" opacity="0.5" />
          <path
            d="M28.5 19.5L25.6 25.6L19.5 28.5L22.4 22.4L28.5 19.5Z"
            fill="#A3E635"
            stroke="#FAF7F2"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="24" r="1.5" fill="#072C2F" />
        </svg>
      );

    case 'think-ahead':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <rect width="48" height="48" rx="14" fill="#ECFCCB" />
          <path
            d="M12 34C17 34 18 22 25 22H34"
            stroke="#0F5C61"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M29.5 17.5L35 22L29.5 26.5"
            stroke="#0F5C61"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="17" r="4" fill="#84CC16" />
          <path
            d="M15 10.5V11.8M15 22.2V23.5M8.5 17H9.8M20.2 17H21.5M10.4 12.4L11.4 13.4M18.6 20.6L19.6 21.6"
            stroke="#4D7C0F"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
