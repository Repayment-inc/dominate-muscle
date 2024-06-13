import { Outlet } from "react-router-dom";
// import { Header } from "../notifications/organisms/Header";
import { Footer } from "../notifications/organisms/Footer";
// import Footer from "./Footer"

export default function Layout() {
  return (
    <>
      {/* <Header /> */}
      <h1> Dominate muscle</h1>
      <main>
        <Outlet />
      </main>
      <Footer />
      {/* <h1 className="fixed bottom-0"> Dominate muscle</h1> */}
    </>
  );
}
