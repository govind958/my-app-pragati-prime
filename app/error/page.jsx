'use client'

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black px-4">
      <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-500 mb-3">
          Error
        </h1>
        <p className="text-zinc-700 dark:text-zinc-300 text-lg">
          Something went wrong. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
