import { asset } from "@/lib/site";

/**
 * Every image on this site carries a provenance label, so a reader always
 * knows whether they are looking at the running build, a design export,
 * the real UI fed with sample data, or a proposed concept.
 */
export type Provenance = "build" | "design" | "sample" | "concept" | "site";

const PROVENANCE: Record<Provenance, string> = {
  build: "Running build · captured locally",
  design: "Design export · Google Stitch",
  sample: "Real UI · sample data",
  concept: "Concept · not implemented",
  site: "Marketing site · captured locally",
};

export function Tag({ kind, children }: { kind: Provenance; children?: React.ReactNode }) {
  return (
    <span className={`prov prov-${kind}`}>
      <span className="prov-dot" aria-hidden="true" />
      {children ?? PROVENANCE[kind]}
    </span>
  );
}

type ImgProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function Img({ src, alt, width, height, className, priority }: ImgProps) {
  return (
    // Static export: images are pre-optimised WebP in /public/work.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(src)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}

export function Phone({ className = "", ...img }: ImgProps) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <Img {...img} />
      </div>
    </div>
  );
}

export function Browser({ url, className = "", ...img }: ImgProps & { url: string }) {
  return (
    <div className={`browser ${className}`}>
      <div className="browser-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>{url}</em>
      </div>
      <Img {...img} />
    </div>
  );
}

export function Figure({
  kind,
  caption,
  children,
  className = "",
}: {
  kind: Provenance;
  caption: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={`fig ${className}`}>
      {children}
      <figcaption>
        <Tag kind={kind} />
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
