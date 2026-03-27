import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black px-6 text-center">
      
      <div className="flex flex-col items-center justify-center gap-6 -mt-16">
        
        {/* Title */}
        <h1 className="text-6xl font-extrabold tracking-tight">
          Primetrade 🚀
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-700 max-w-md leading-relaxed">
          Manage your tasks efficiently with secure authentication
          and admin control.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <Link href="/login">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition">
              Register
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}