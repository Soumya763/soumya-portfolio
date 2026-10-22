import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nf">
      <div>
        <p className="eyebrow" style={{ justifyContent: "center" }}>
          404
        </p>
        <h1 className="display h-l">This page isn&apos;t in the wardrobe.</h1>
        <p className="lede" style={{ margin: "20px auto 32px" }}>
          The link may be old or mistyped.
        </p>
        <Link className="btn btn-primary" href="/">
          Back to the portfolio <span className="arr" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
