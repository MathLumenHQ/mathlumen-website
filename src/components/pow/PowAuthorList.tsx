import type { PowAuthorWithAffiliations } from "@/schema/types";

interface PowAuthorListProps {
  authors: PowAuthorWithAffiliations[];
}

export function PowAuthorList({ authors }: PowAuthorListProps) {
  if (authors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {authors.map((author) => (
        <div key={author.id} className="border-l border-gold/[0.18] pl-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-display text-lg font-semibold text-paper">
              {author.name}
            </p>
            {author.corresponding && (
              <span className="inline-flex items-center border border-gold/20 bg-gold/8 px-2 py-px font-mono text-[10px] uppercase tracking-wider text-gold-light">
                Corresponding
              </span>
            )}
          </div>
          {(author.email || author.orcid) && (
            <p className="mt-1 font-mono text-xs text-muted">
              {author.email && <span>{author.email}</span>}
              {author.email && author.orcid && <span className="text-gold/30"> &middot; </span>}
              {author.orcid && <span>ORCID {author.orcid}</span>}
            </p>
          )}
          {author.affiliations.length > 0 && (
            <ul className="mt-2 space-y-1">
              {author.affiliations.map((affiliation) => (
                <li key={affiliation.id} className="text-sm text-muted">
                  {affiliation.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
