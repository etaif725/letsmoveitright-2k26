interface PromoBannerProps {
  text?: string;
  buttonText?: string;
}

export default function PromoBanner({
  text = "YOUR NEXT MOVE STARTS WITH A FREE QUOTE",
  buttonText = "GET A FREE QUOTE NOW",
}: PromoBannerProps) {
  function scrollToQuoteForm(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById("quoteForm");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <section className="bg-primary py-8 lg:hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center">
        <h2 className="font-heading text-xl text-dark-accent md:text-2xl">
          {text}
        </h2>
        <button
          type="button"
          onClick={scrollToQuoteForm}
          className="inline-block rounded-lg bg-heading px-8 py-3.5 text-base font-bold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-dark-accent hover:shadow-md active:scale-[0.98]"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}
