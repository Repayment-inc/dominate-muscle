// import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, Navigate } from "react-router-dom";

// import { ProtectedRoute } from '@/lib/auth';

// import { discussionLoader } from './app/discussions/discussion';
// import { discussionsLoader } from './app/discussions/discussions';
// import { AppRoot } from './app/root';
// import { usersLoader } from './app/users';

import { History } from "@/app/routes/app/History";
import LoginPage from "@/app/routes/auth/login";
import { RegisterPage } from "./auth/register";
import { ProtectedRoutes } from "@/app/routes/protected-routes";
// import { Dashboard } from "@/app/routes/pages/Dashboard";
// import { TrainingPage } from "@/app/routes/pages/training/TrainingPage";
import { Exercises } from "./app/Exercises";
// import { useMemo } from "react";
import { AppRoot } from "./app/root";

// ブラウザRouterの初期化
export const createRouter = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      // const { LandingRoute } = await import("./landing");
      // return { Component: LandingRoute };
      const redirectTo = "/app";

      return {
        Component: () => <Navigate to={redirectTo} replace />,
      };
    },
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  //新規登録ページ
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
  {
    path: "/app",
    element: (
      // Token認証確認
      <ProtectedRoutes>
        <AppRoot />
      </ProtectedRoutes>
    ),
    children: [
      /* ダッシュボード */
      {
        path: "",
        lazy: async () => {
          const { Dashboard } = await import("./app/Dashboard");
          return { Component: Dashboard };
        },
      },
      /* トレーニング開始 */
      {
        // element: <TrainingPage />,

        path: "training",
        lazy: async () => {
          const { TrainingPage } = await import("./app/traning");
          return { Component: TrainingPage };
        },
        // loader: discussionsLoader(queryClient),
      },
      /* トレーニング履歴 */
      {
        path: "history",
        element: <History />,
      },
      /* エクササイズ一覧 */
      {
        path: "exercises",
        element: <Exercises />,
      },
    ],
  },
  {
    path: "*",
    lazy: async () => {
      const { NotFoundRoute } = await import("./not-found");
      return { Component: NotFoundRoute };
    },
  },
]);
