import React, { useState } from "react";

import { Header } from "@/components/notifications/organisms/Header";
// import "./page.css";
import { registerUser } from "@/hooks/useAPI";
import ErrorModal from "../organisms/ErrorModal";

type User = {
  name: string;
};

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [signUpInfo, setSignUpInfo] = useState({ username: '', email: '', password: '' });

  const handleSignUp = async () => {
    try {
      const newUser = await registerUser(signUpInfo);
      setUser(newUser);
      setIsSignUpModalOpen(false);
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorMessage('Signup failed');
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

      {isSignUpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded">
            <h2>Sign Up</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={signUpInfo.username}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signUpInfo.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signUpInfo.password}
              onChange={handleInputChange}
            />
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={() => setIsSignUpModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-hero-pattern bg-cover bg-center h-screen flex justify-center items-center">

      <section className="storybook-page max-w-xl bg-gray-500">
        <h2 className="text-5xl text-red-500">Go to the Gym</h2>
        <p>
          We recommend building UIs with a{" "}
          <a
            href="https://componentdriven.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>component-driven</strong>
          </a>{" "}
          process starting with atomic components and ending with pages.
        </p>
        <p>
          Render pages with mock data. This makes it easy to build and review
          page states without needing to navigate to them in your app. Here are
          some handy patterns for managing page data in Storybook:
        </p>
        <ul>
          <li>
            Use a higher-level connected component. Storybook helps you compose
            such data from the args of child component stories
          </li>
          <li>
            Assemble data in the page component from your services. You can mock
            these services out using Storybook.
          </li>
        </ul>
        <p>
          Get a guided tutorial on component-driven development at{" "}
          <a
            href="https://storybook.js.org/tutorials/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Storybook tutorials
          </a>
          . Read more in the{" "}
          <a
            href="https://storybook.js.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            docs
          </a>
          .
        </p>

        
       
        
      </section>
      </div>
    </article>
  );
};
