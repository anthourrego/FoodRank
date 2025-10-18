import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export timezone utilities for backward compatibility
export { 
  getCurrentDateTimeLocal as getLocalDateTimeString,
  formatForDateTimeLocal as formatDateToLocalDateTimeString
} from './timezone'
