import React from "react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <h2>エラーが発生しました</h2>
        <p>{errorMessage}</p>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default ErrorModal;
