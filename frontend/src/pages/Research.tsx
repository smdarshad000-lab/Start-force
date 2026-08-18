import { PageContainer } from '../components/layout/PageContainer';

export function Research() {
  return (
    <PageContainer>
      <section className="py-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
          Research
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Research intelligence
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Discover research connected to ideas, technologies and opportunities.
        </p>
      </section>
    </PageContainer>
  );
}