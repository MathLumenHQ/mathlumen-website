import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the server action before importing the component
vi.mock("@/actions/subscribe", () => ({
  subscribeAction: vi.fn().mockResolvedValue({ success: true, data: { email: "test@example.com" } }),
}));

import { NewsletterForm } from "@/components/forms/NewsletterForm";

describe("NewsletterForm", () => {
  it("renders email input and subscribe button", () => {
    render(<NewsletterForm />);
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("shows the no-spam disclaimer", () => {
    render(<NewsletterForm />);
    expect(screen.getByText(/No spam/)).toBeInTheDocument();
  });

  it("has a required email input", () => {
    render(<NewsletterForm />);
    expect(screen.getByLabelText("Email address")).toBeRequired();
  });
});
