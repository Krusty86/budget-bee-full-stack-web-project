import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../../assets/css/global.css";
import "../../assets/Vendor/fontawesome-free-6.7.2-web/css/all.css"

const UserLayout = () => {
  return (
    <>
      <Sidebar />

      <main className="page-content">
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;