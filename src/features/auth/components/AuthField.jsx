export default function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 focus:border-primary focus:ring-primary"
        required
        {...rest}
      />
    </div>
  );
}
