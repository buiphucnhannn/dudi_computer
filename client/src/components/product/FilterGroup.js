export default function FilterGroup({
  title,
  items,
  selected,
  type = "multiple",
  onChange,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 border-b border-gray-100 pb-3 text-sm font-black uppercase tracking-wide text-gray-900">
        {title}
      </h3>

      <div className="space-y-3">
        {items.map((item) => {
          const label = typeof item === "string" ? item : item.label;

          const value = typeof item === "string" ? item : item.value;

          const checked =
            type === "single" ? selected === value : selected.includes(value);

          return (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type={type === "single" ? "radio" : "checkbox"}
                checked={checked}
                onChange={() => onChange(value)}
                className="h-4 w-4 accent-[#dc2626]"
              />

              <span
                className={`text-sm ${
                  checked ? "font-bold text-[#dc2626]" : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
