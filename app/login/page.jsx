import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <form className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 w-full max-w-sm space-y-6 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold text-center text-zinc-800 dark:text-zinc-100">
          Welcome Back
        </h1>

        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1"
            >
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
          <button
            formAction={login}
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="w-full py-2 rounded-lg bg-zinc-200 text-zinc-800 font-medium hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600 transition-colors duration-200"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}
