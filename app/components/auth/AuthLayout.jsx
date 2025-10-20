import Image from "next/image";
import Link from "next/link";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="inline-block">
            <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-xl">
              TP
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        {subtitle && <div className="mt-2">{subtitle}</div>}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200 shadow-sm sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
