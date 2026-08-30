import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const LearnerLayout = () => {
  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-800">
      <Sidebar />

      <div className="min-h-screen lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
};

export default LearnerLayout;
