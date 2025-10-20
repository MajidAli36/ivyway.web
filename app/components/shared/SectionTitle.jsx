export default function SectionTitle({ title, subtitle, centered = true }) {
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} mb-16`}>
      <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}
