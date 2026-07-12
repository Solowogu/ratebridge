export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-blue-600">
        RateBridge
      </h1>

      <div className="flex gap-4">
        <button className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
          Login
        </button>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Sign Up
        </button>
      </div>
    </nav>
  );
}