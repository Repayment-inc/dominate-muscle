import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// import ErrorModal from "../../../../components/notifications/organisms/ErrorModal";
// import SignUpModal from "@/components/notifications/organisms/SignUpModal";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/hooks/useAPI";
import { Layout } from "@/components/layouts/auth-layouts";

// import logo from "@/assets/react.svg";
// import { Head } from "@/components/seo";
import { Link } from "@/components/ui/link";
// import { cn } from "@/lib/utils";

// import {
//   GiWalk,
//   GiWeightLiftingUp,
//   GiSensuousness,
//   GiRun,
//   GiBiceps,
// } from "react-icons/gi";
// import { LiaDumbbellSolid } from "react-icons/lia";
// import { FaDumbbell } from "react-icons/fa6";

// type User = {
//   name: string;
//   token?: string;
// };

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // const [user, setUser] = React.useState<User>();
  // const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  // フォームの入力フィールドが変更された際、イベントが発火
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  // サインアップイベント発火
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const newUser = await loginUser(loginInfo);
      // setUser(newUser);
      await loginUser(loginInfo);
      navigate("/app");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  // demo用
  const handleSetDemoToken = () => {
    localStorage.setItem("accessToken", "testToken");
    navigate("/app");
  };

  return (
    <>
      <Layout title="Login your account">
        <div className="bg-white p-4 rounded space-y-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            <input
              type="email"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-gray-500"
              name="email"
              placeholder="Email"
              value={loginInfo.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-gray-500"
              name="password"
              placeholder="Password"
              value={loginInfo.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900/90 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300"
            >
              Login in
            </button>
          </form>
          <Button className="text-sm bottom-0" onClick={handleSetDemoToken}>
            テスト用トークンセット
          </Button>

          <div className="mt-2 flex items-center justify-end">
            <div className="text-sm">
              <Link
                to={`/auth/register`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                register
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default LoginPage;
