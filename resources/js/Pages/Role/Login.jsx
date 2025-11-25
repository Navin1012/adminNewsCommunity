import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  const { flash } = usePage().props;

  const [showPass, setShowPass] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route("role.login.submit"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submit}
        className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-md space-y-5 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Employee Login
        </h2>

        {/* FLASH MESSAGES */}
        {flash?.success && (
          <p className="animate-fade bg-green-100 text-green-700 border border-green-300 px-4 py-2 rounded-lg text-sm font-medium">
            {flash.success}
          </p>
        )}

        {flash?.error && (
          <p className="animate-fade bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg text-sm font-medium">
            {flash.error}
          </p>
        )}

        {/* EMAIL */}
        <div className="space-y-1">
          <input
            type="email"
            placeholder="Email address"
            className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-red-600 text-sm font-medium">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-1 relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className={`w-full border p-3 rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-400" : "border-gray-300"
            }`}
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
          />

          {/* Show/Hide Toggle */}
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-gray-700"
          >
            {showPass ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>

          {errors.password && (
            <p className="text-red-600 text-sm font-medium">{errors.password}</p>
          )}
        </div>

        {/* BUTTON */}
        <button
          disabled={processing}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Animations */}
      <style>
        {`
          @keyframes fade {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade {
            animation: fade .3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
