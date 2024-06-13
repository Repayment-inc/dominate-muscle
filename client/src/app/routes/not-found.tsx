import { Link } from "@/components/ui/link";

export const NotFoundRoute = () => {
  return (
    <div className="mt-52 flex flex-col items-center font-semibold">
      <h1>404 - Not Found</h1>
      <p>申し訳ありませんが、お探しのページは存在しません。</p>
      <Link to="/" replace>
        ホーム画面に戻る
      </Link>
    </div>
  );
};
