export type CommentGroup = {
  id: string;
  label: string;
  color: string;
  comments: Record<string, string>;
};

export function CommentGroups({
  groups,
  categories,
  title,
}: {
  groups: CommentGroup[];
  categories: readonly string[];
  title: string;
}) {
  const visible = categories.filter((category) =>
    groups.some((group) => group.comments[category]?.trim())
  );
  if (visible.length === 0) return null;
  return (
    <section className="space-y-3" data-testid="comment-groups">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      {visible.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-600">{category}</h4>
          {groups.map((group) => {
            const comment = group.comments[category]?.trim();
            return comment ? (
              <div
                key={`${category}-${group.id}`}
                className="rounded-r-md border-l-2 bg-slate-50 px-3 py-2"
                style={{ borderLeftColor: group.color }}
              >
                <p className="text-[11px] font-medium text-slate-500">{group.label}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{comment}</p>
              </div>
            ) : null;
          })}
        </div>
      ))}
    </section>
  );
}
