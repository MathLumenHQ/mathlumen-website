import { describe, it, expect } from "vitest";
import {
  formatDate,
  slugify,
  calculateReadTime,
  truncate,
  formatNumber,
  cn,
} from "@/lib/utils";

describe("formatDate", () => {
  it("formats an ISO string into a readable date", () => {
    expect(formatDate("2025-03-15")).toBe("March 15, 2025");
  });

  it("formats a Date object", () => {
    expect(formatDate(new Date(2025, 0, 1))).toBe("January 1, 2025");
  });

  it("accepts a custom format string", () => {
    expect(formatDate("2025-06-20", "yyyy/MM/dd")).toBe("2025/06/20");
  });

  it('returns "Invalid date" for garbage input', () => {
    expect(formatDate("not-a-date")).toBe("Invalid date");
  });
});

describe("slugify", () => {
  it("converts text to a URL-safe slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("What is 2+2?")).toBe("what-is-22");
  });

  it("handles accented characters", () => {
    expect(slugify("café résumé")).toBe("cafe-resume");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a---b---c")).toBe("a-b-c");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --hello--  ")).toBe("hello");
  });
});

describe("calculateReadTime", () => {
  it("returns 1 min for short content", () => {
    expect(calculateReadTime("Just a few words")).toBe(1);
  });

  it("returns correct minutes for longer content", () => {
    const words = Array(600).fill("word").join(" ");
    expect(calculateReadTime(words)).toBe(3);
  });

  it("rounds up to the next minute", () => {
    const words = Array(201).fill("word").join(" ");
    expect(calculateReadTime(words)).toBe(2);
  });
});

describe("truncate", () => {
  it("returns the original text if under the limit", () => {
    expect(truncate("short", 100)).toBe("short");
  });

  it("truncates at the last word boundary and adds ellipsis", () => {
    const result = truncate("This is a longer sentence that will be truncated", 20);
    expect(result).toBe("This is a longer...");
    expect(result.length).toBeLessThanOrEqual(23); // 20 chars + "..."
  });

  it("handles exact boundary length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("formatNumber", () => {
  it("returns plain number below 1000", () => {
    expect(formatNumber(42)).toBe("42");
  });

  it("formats thousands with k", () => {
    expect(formatNumber(1200)).toBe("1.2k");
  });

  it("formats millions with M", () => {
    expect(formatNumber(1500000)).toBe("1.5M");
  });

  it("drops trailing .0", () => {
    expect(formatNumber(2000)).toBe("2k");
    expect(formatNumber(1000000)).toBe("1M");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("deduplicates tailwind classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});
