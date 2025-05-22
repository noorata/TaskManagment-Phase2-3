export default function AuthLayout({ title, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-white">
      <div className="w-full max-w-md rounded-lg bg-surface2 p-8 shadow-lg">
        <h1 className="mb-8 text-3xl font-bold">{title}</h1>
        {children}
      </div>
    </div>
  );
}
