export const Loading = () => {
  return (
    <div className="flex min-h-screen justify-center items-center" aria-label="読み込み中">
      <div className="animate-spin h-8 w-8 bg-blue-300 rounded-xl"></div>
      <div className="animate-spin h-8 w-8 bg-blue-300 rounded-xl mx-4"></div>
      <div className="animate-spin h-8 w-8 bg-blue-300 rounded-xl"></div>
    </div>
  );
};