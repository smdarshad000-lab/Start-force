import { PageContainer } from '../components/layout/PageContainer';

export function Profile() {
  return (
    <PageContainer>
      <section className="py-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
          Profile
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Your innovation profile
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Skills, research, experience, interests and projects.
        </p>
      </section>
    </PageContainer>
  );
}