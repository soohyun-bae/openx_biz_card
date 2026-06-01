export const TemplateThumb = ({ templateId }: { templateId: string }) => {
  const sharedClass = "h-[54px] w-[92px] overflow-hidden rounded border";

  if (templateId === "openx") {
    return (
      <span className={`${sharedClass} border-slate-300 bg-zinc-50 p-2`}>
        <span className="block h-full border border-slate-900 p-1">
          <span className="block h-2 w-8 bg-slate-900" />
          <span className="mt-3 block h-1.5 w-12 bg-slate-500" />
        </span>
      </span>
    );
  }

  if (templateId === "bold") {
    return (
      <span className={`${sharedClass} border-slate-900 bg-slate-900`}>
        <span className="block h-full w-8 bg-orange-500" />
      </span>
    );
  }

  if (templateId === "editorial") {
    return (
      <span className={`${sharedClass} border-stone-300 bg-[#f8f5ef] p-2`}>
        <span className="block h-full w-4 bg-neutral-800" />
      </span>
    );
  }

  if (templateId === "tech") {
    return (
      <span className={`${sharedClass} border-slate-300 bg-slate-50 p-2`}>
        <span className="block h-4 w-4 bg-teal-500" />
        <span className="mt-4 block h-2 w-14 bg-slate-900" />
      </span>
    );
  }

  return (
    <span className={`${sharedClass} border-amber-700 bg-[#f7f2e8] p-2`}>
      <span className="mx-auto mt-1 block h-6 w-6 rotate-45 bg-slate-800" />
    </span>
  );
};
