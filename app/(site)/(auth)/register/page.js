"use client";

import { useState, Fragment } from "react";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  Check,
  ChevronDown,
  User,
  Mail,
  Lock,
  GraduationCap,
  Users,
  Pencil,
  CheckCircle,
  BookOpen,
} from "lucide-react";

const roles = [
  { id: 1, name: "Student", value: "student", icon: GraduationCap },
  { id: 2, name: "Tutor", value: "tutor", icon: Pencil },
  { id: 3, name: "Counselor", value: "counselor", icon: Users },
  { id: 4, name: "Teacher", value: "teacher", icon: BookOpen },
];

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: roles[0],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Register user with JWT backend
      const userData = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role.value,
      };

      const response = await register(userData);

      // Show success modal
      setRegistrationData({
        name: formData.name,
        role: formData.role.value,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigateToLogin = () => {
    // After successful registration, direct users to the login page
    router.push("/login");
  };

  const RoleIcon = formData.role.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-200 to-blue-100 rounded-b-[50%] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-blue-100 to-blue-200 rounded-t-[50%] opacity-30"></div>

      {/* Floating shapes with softer colors */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-blue-100 rounded-full opacity-40 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-50 rounded-full opacity-40 animate-float-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-blue-100 rounded-full opacity-30 animate-float-delayed"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden relative z-10">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <h2 className="text-3xl font-bold text-center mb-2">
            Join Our Learning Community
          </h2>
          <p className="text-center text-blue-50">
            Create your account to start your educational journey
          </p>
        </div>

        <div className="px-8 py-6 pb-8">
          <div className="flex justify-center -mt-12 mb-5">
            <div className="bg-white p-2 rounded-full shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full flex items-center justify-center">
                <RoleIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="pl-10 block w-full px-3 py-3 border border-blue-100 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition-all"
                  placeholder="What should we call you?"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 block w-full px-3 py-3 border border-blue-100 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full px-3 py-3 border border-blue-100 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition-all"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <Listbox
                value={formData.role}
                onChange={(role) => setFormData({ ...formData, role })}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer py-3 pl-3 pr-10 text-left border border-blue-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm">
                    <span className="flex items-center">
                      <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center mr-2 text-blue-500">
                        <RoleIcon size={18} />
                      </span>
                      <span className="block truncate">
                        {formData.role.name}
                      </span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {roles.map((role) => (
                        <Listbox.Option
                          key={role.id}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-blue-50 text-blue-900"
                                : "text-gray-900"
                            }`
                          }
                          value={role}
                        >
                          {({ selected }) => (
                            <>
                              <span className="flex items-center">
                                <role.icon className="h-5 w-5 mr-2 text-blue-500" />
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {role.name}
                                </span>
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <Check
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all transform hover:translate-y-[-1px]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Setting up your account...
                  </div>
                ) : (
                  "Begin Your Learning Journey"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog
        as="div"
        className="relative z-50"
        open={showSuccessModal}
        onClose={() => {}}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <Dialog.Title className="text-2xl font-semibold text-gray-900 text-center">
                Welcome to IvyWay!
              </Dialog.Title>

              <div className="mt-4 text-center">
                <p className="text-lg text-gray-700">
                  Congratulations {registrationData?.name}! Your account has
                  been successfully created.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Please sign in with your new credentials to access your
                  account.
                </p>
              </div>

              <div className="mt-8 w-full">
                <button
                  type="button"
                  onClick={navigateToLogin}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all transform hover:translate-y-[-1px]"
                >
                  Sign In
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
