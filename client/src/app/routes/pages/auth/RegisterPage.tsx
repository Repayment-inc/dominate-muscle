import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "@/hooks/useAPI";
import { Layout } from "@/components/layouts/auth-layouts";
import { useState } from "react";
import { Link } from "react-router-dom";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [signUpInfo, setSignUpInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpInfo({
      ...signUpInfo,
      [e.target.name]: e.target.value,
    });
  };

  // サインアップイベント発火
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(signUpInfo);
      const loginResponse = await loginUser({
        email: signUpInfo.email,
        password: signUpInfo.password,
      });
      localStorage.setItem("token", loginResponse.token);
      navigate("/app"); // Navigate to dashboard after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <>
      <Layout title="Register your account">
        <div className="bg-white p-4 rounded space-y-8">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <input
              type="text"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-gray-500"
              name="username"
              placeholder="Username"
              value={signUpInfo.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-gray-500"
              name="email"
              placeholder="Email"
              value={signUpInfo.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-gray-500"
              name="password"
              placeholder="Password"
              value={signUpInfo.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900/90 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-2 flex items-center justify-end">
            <div className="text-sm">
              <Link
                to={`/auth/login`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                login
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
