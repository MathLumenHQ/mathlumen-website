import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
} from "date-fns";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * Handles conditional classes and deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date into a human-readable string.
 * @param date - Date object, ISO string, or timestamp
 * @param formatStr - date-fns format string (default: "MMMM d, yyyy")
 * @returns Formatted date string (e.g., "March 15, 2026")
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = "MMMM d, yyyy"
): string {
  const parsed = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(parsed)) {
    return "Invalid date";
  }

  return format(parsed, formatStr);
}

/**
 * Format a date as a relative time string.
 * @param date - Date object, ISO string, or timestamp
 * @returns Relative date string (e.g., "3 days ago")
 */
export function formatRelativeDate(date: Date | string | number): string {
  const parsed = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(parsed)) {
    return "Invalid date";
  }

  return formatDistanceToNow(parsed, { addSuffix: true });
}

/**
 * Create a URL-safe slug from text.
 * Handles unicode, removes special characters, and collapses hyphens.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate estimated read time from content.
 * Assumes an average reading speed of 200 words per minute.
 */
export function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Truncate text to a maximum length, adding an ellipsis if truncated.
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }

  const truncated = text.slice(0, length);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

/**
 * Format a number into a compact, human-readable string.
 * @example formatNumber(1200) → "1.2k"
 * @example formatNumber(1500000) → "1.5M"
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return n.toString();
}
