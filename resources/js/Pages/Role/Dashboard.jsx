import { Link, router } from "@inertiajs/react";

export default function Dashboard({ role }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome, {role.name} ({role.role})
      </h1>

      <form onSubmit={() => router.post(route("role.logout"))}>
        <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>
    </div>
  );
}
