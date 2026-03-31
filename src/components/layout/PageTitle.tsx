import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <section className="bg-footer-bg bg-[url('/images/title-area-pattern.png')] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm uppercase tracking-wider text-body">{subtitle}</p>}
        <Breadcrumbs />
      </div>
    </section>
  );
}
