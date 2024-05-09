import React from "react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  email: string;
  password: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignUp: () => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  username,
  email,
  password,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onSignUp,
  errorMessage,
  setErrorMessage,
}) => {
  // モーダルが開かれたときにエラーメッセージをリセット
  React.useEffect(() => {
    setErrorMessage("");
  }, [isOpen, setErrorMessage]);

  const handleSignUpClick = () => {
    if (!username || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }
    setErrorMessage(""); // Clear any existing error messages
    onSignUp();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Sign in to your account
        </h2>
        <form className="space-y-6">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <input
            type="text"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-gray-500"
            name="username"
            value={username}
            onChange={onUsernameChange}
            placeholder="Username"
            required
          />

          <input
            type="email"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-gray-500"
            name="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-gray-500"
            name="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            required
          />
          <button
            onClick={handleSignUpClick}
            className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900/90 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300"
          >
            Sign Up
          </button>
          <button
            onClick={onClose}
            className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
