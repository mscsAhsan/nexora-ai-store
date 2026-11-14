export default function PageHeader({ title, subtitle, children }) {
  return (
    <section className="noise relative isolate overflow-hidden pb-10 pt-36">
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="absolute -left-20 top-0 -z-10 h-[360px] w-[360px] animate-blob rounded-full bg-violet-brand/25 blur-[110px]" />
      <div className="absolute -right-16 top-10 -z-10 h-[320px] w-[320px] animate-blob rounded-full bg-cyan-brand/15 blur-[110px]" style={{ animationDelay: "-6s" }} />
      <div className="section text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
