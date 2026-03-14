import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { ArticleWithAuthor } from "@/schema/types";

const mockArticle: ArticleWithAuthor = {
  id: "test-1",
  slug: "test-article",
  title: "Introduction to Topology",
  subtitle: "A gentle primer",
  excerpt: "Topology studies properties preserved under continuous deformations.",
  category: "research",
  isPublished: true,
  featured: false,
  coverImageUrl: null,
  readTimeMinutes: 8,
  viewCount: 100,
  tags: ["research", "math"],
  searchVector: null,
  publishedAt: new Date("2025-06-15"),
  createdAt: new Date("2025-06-01"),
  updatedAt: new Date("2025-06-15"),
  authorId: "author-1",
  author: {
    id: "author-1",
    name: "Ada Lovelace",
    slug: "ada-lovelace",
    bio: "Mathematician",
    avatarUrl: null,
    email: null,
    twitterHandle: null,
    linkedinUrl: null,
    websiteUrl: null,
    createdAt: new Date("2025-01-01"),
  },
};

describe("ArticleCard", () => {
  it("renders title", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Introduction to Topology")).toBeInTheDocument();
  });

  it("renders excerpt", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(
      screen.getByText(/Topology studies properties/)
    ).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("research")).toBeInTheDocument();
  });

  it("links to correct slug URL", () => {
    render(<ArticleCard article={mockArticle} />);
    const links = screen.getAllByRole("link");
    const articleLink = links.find((l) =>
      l.getAttribute("href")?.includes("/articles/test-article")
    );
    expect(articleLink).toBeDefined();
  });

  it("shows author name", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("shows formatted date", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("June 15, 2025")).toBeInTheDocument();
  });

  it("shows read time", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("8 min")).toBeInTheDocument();
  });
});
