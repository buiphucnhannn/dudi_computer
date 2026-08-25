export default function FilterGroup({
  title,
  items,
  selected,
  type = "multiple",
  onChange,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs">
      <h3 className="mb-3.5 border-b border-gray-100 pb-2.5 text-xs sm:text-sm font-black uppercase tracking-wide text-gray-900">
        {title}
      </h3>

      <div className="space-y-2.5">
        {items.map((item) => {
          const label = typeof item === "string" ? item : item.label;
          const value = typeof item === "string" ? item : item.value;
          const count = typeof item === "object" && typeof item.count === "number" ? item.count : undefined;

          const checked =
            type === "single" ? selected === value : selected.includes(value);

          return (
            <label
              key={value}
              className="flex cursor-pointer items-center justify-between group py-0.5 select-none"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <input
                  type={type === "single" ? "radio" : "checkbox"}
                  checked={checked}
                  onChange={() => onChange(value)}
                  className="h-4 w-4 accent-[#dc2626] cursor-pointer shrink-0"
                />

                <span
                  className={`text-xs sm:text-sm truncate transition-colors ${
                    checked ? "font-bold text-[#dc2626]" : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {label}
                </span>
              </div>

              {count !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full shrink-0 transition-colors ${
                    checked
                      ? "bg-red-100 text-red-700 font-bold"
                      : "text-gray-400 bg-gray-100 group-hover:text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
