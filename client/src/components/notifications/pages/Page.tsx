import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added

import { Header } from "@/components/notifications/organisms/Header";
// import "./page.css";
import { registerUser } from "@/hooks/useAPI";
import ErrorModal from "../organisms/ErrorModal";
import SignUpModal from "../organisms/SignUpModal";

type User = {
  name: string;
};

export const Page: React.FC = () => {
  const navigate = useNavigate(); // Added
  const [user, setUser] = React.useState<User>();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [signUpInfo, setSignUpInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    try {
      const newUser = await registerUser(signUpInfo);
      setUser(newUser);
      setIsSignUpModalOpen(false);
      navigate("/dashboard"); // Navigate to dashboard after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("Signup failed");
      setIsErrorModalOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
  };

  return (
    <article>
      <Header
        user={user}
        onLogin={() => setUser({ name: "Jane Doe" })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setIsSignUpModalOpen(true)}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errorMessage={errorMessage}
      />

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        username={signUpInfo.username}
        email={signUpInfo.email}
        password={signUpInfo.password}
        onUsernameChange={handleInputChange}
        onEmailChange={handleInputChange}
        onPasswordChange={handleInputChange}
        onSignUp={handleSignUp}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

      {/* // {isSignUpModalOpen && ( 
      //   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      //     <div className="bg-white p-4 rounded">
      //       <h2>Sign Up</h2>
      //       <input
      //         type="text"
      //         name="username"
      //         placeholder="Username"
      //         value={signUpInfo.username}
      //         onChange={handleInputChange}
      //       />
      //       <input
      //         type="email"
      //         name="email"
      //         placeholder="Email"
      //         value={signUpInfo.email}
      //         onChange={handleInputChange}
      //       />
      //       <input
      //         type="password"
      //         name="password"
      //         placeholder="Password"
      //         value={signUpInfo.password}
      //         onChange={handleInputChange}
      //       />
      //       <button onClick={handleSignUp}>Sign Up</button>
      //       <button onClick={() => setIsSignUpModalOpen(false)}>Cancel</button>
      //     </div>
      //   </div>
      // )}
      */}

      <div className="bg-hero-pattern bg-cover bg-center h-screen flex justify-center items-center">
        <section className="storybook-page max-w-xl bg-gray-500">
          <h2 className="text-5xl text-red-500">Go to the Gym</h2>
          <p>
            おすすめプロテインはこちら{" "}
            <a
              href="https://componentdriven.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>こちら</strong>
            </a>{" "}
            から!!
          </p>
        </section>
      </div>
    </article>
  );
};
