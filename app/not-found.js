import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section grid min-h-[70vh] place-items-center pt-32 text-center">
      <div>
        <p className="shimmer-text text-8xl font-extrabold">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted">The page you are looking for does not exist.</p>
        <Link href="/" className="btn-primary mt-8">Back to home</Link>
      </div>
    </section>
  );
}
