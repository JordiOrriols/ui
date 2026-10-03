export function ButtonGroup({
  label,
  items,
  onToggle,
}: {
  label: string;
  items: { value: string; label: string; selected: boolean; disabled?: boolean }[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={item.selected}
          disabled={item.disabled}
          onClick={() => onToggle(item.value)}
          className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
            item.selected
              ? "bg-indigo-50 border-indigo-300 text-indigo-700"
              : "bg-white border-slate-200 text-slate-400 line-through"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
