import React from 'react';

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
  onSignUp
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <h2>Sign Up</h2>
        <input type="text" value={username} onChange={onUsernameChange} placeholder="Username" />
        <input type="email" value={email} onChange={onEmailChange} placeholder="Email" />
        <input type="password" value={password} onChange={onPasswordChange} placeholder="Password" />
        <button onClick={onSignUp}>Sign Up</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default SignUpModal;
