import React, { } from "react";
// import { useNavigate } from "react-router-dom"; // Added

// import { Header } from "@/components/notifications/organisms/Header";
// import "./page.css";
// import {
//   registerUser,
//   loginUser
// } from "@/hooks/useAPI";
// import ErrorModal from "../../../components/notifications/organisms/ErrorModal";
// import SignUpModal from "../../../components/notifications/organisms/SignUpModal";
// import { Button } from "@/components/ui/button";
// import { LOGIN_USER } from "@/components/common/testUserData";

import { Footer } from "@/components/notifications/organisms/Footer";

// type User = {
//   name: string;
//   token?: string;
// };

export const Dashboard: React.FC = () => {
  // const navigate = useNavigate(); // Added
  // const [user, setUser] = React.useState<User>();
  // const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  // const [signUpInfo, setSignUpInfo] = useState({
  //   username: "",
  //   email: "",
  //   password: "",
  // });

  // useEffect(() => {
  //   // if (user?.token) {
  //   //   navigate("/app");
  //   // }
  //   if (!localStorage.getItem("accessToken")) {
  //     navigate("/app");
  //   }
  // }, [user, navigate]);

  // const handleSignUp = async () => {
  //   try {
  //     const newUser = await registerUser(signUpInfo);
  //     setUser(newUser);
  //     setIsSignUpModalOpen(false);
  //     navigate("/app"); // Navigate to dashboard after successful signup
  //   } catch (error) {
  //     console.error("Signup failed:", error);
  //     setErrorMessage("Signup failed");
  //     setIsErrorModalOpen(true);
  //   }
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
  // };

  // const handleLogin = async () => {
  //   try {
  //     const loginData = {
  //       // userId: "askdfj3ksdfjk",  idはこっちで絶対に保持しない。トークンのみ保持。セキュリティリスクが有るため
  //       name: "admin1",
  //       email: "admin14@gmail.com",
  //       password: "pass",
  //     };
  //     // const response = await loginUser(loginData);
  //     // setUser({ username: "Jane Doe", token: response.resultData.token });

  //     setUser({ name: "testname", token: LOGIN_USER[0].token }); // テストユーザ
  //     localStorage.setItem("accessToken", LOGIN_USER[0].token);
  //     // localStorage.setItem('refreshToken', "testRefeshToken"); //Refreshトークンは今後実装
  //     navigate("/app"); // Navigate to dashboard after successful login
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem("accessToken");
  //   // localStorage.removeItem("refreshToken");  //Refreshトークンは今後実装
  //   alert("トークンが削除されました");
  // };
  // // if (navigate) {
  // //   return <Navigate to="/signup" />;
  // // }

  return (
    <article>
      <h1>開発中</h1>

      {/* <div className="bg-top-image bg-cover bg-center h-screen flex justify-center items-center">
        <div className="flex flex-col space-y-4">
          <Button className="w-64 h-24">
          トレーニングを記録する
          </Button>

          <Button>
          ダッシュボードを見る
          </Button>
        </div>
      </div> */}

      <Footer />
    </article>
  );
};
