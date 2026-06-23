interface Props {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
      <span className="text-5xl leading-none">🚀</span>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight m-0">
        {title}
      </h2>
      <p className="text-[0.9rem] text-slate-500 m-0 max-w-sm">
        {description ?? "This module is being built. Check back soon."}
      </p>
    </div>
  );
}
