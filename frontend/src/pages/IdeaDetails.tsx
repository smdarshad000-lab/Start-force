import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';

export function IdeaDetails() {
  const { id } = useParams();

  return (
    <PageContainer>
      <section className="py-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
          Idea Intelligence
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Idea {id}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          This will become the complete intelligence page for the selected idea.
        </p>
      </section>
    </PageContainer>
  );
}