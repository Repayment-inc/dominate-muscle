import { RouterProvider } from "react-router-dom";

import { createRouter } from "./routes";

const AppRouter = () => {
  // いずれtanstack queryを使いたいため、残す
  // const queryClient = useQueryClient();
  // const router = useMemo(() => createRouter(queryClient), [queryClient]);

  const router = createRouter;

  return <RouterProvider router={router} />;
};

function App() {
  return <AppRouter />;
}

export default App;
