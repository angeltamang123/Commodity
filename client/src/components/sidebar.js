import React from "react";

const Sidebar = () => {
  return (
    <div className="flex flex-col bg-slate-400 -mt-1  font-bold border-r-1 border-black z-10 -mx-1 border-b-slate-400 p-2 justify-center gap-2">
      <ul className="flex flex-col list-none">
        <li>Ram</li>
        <li>Shyam</li>
        <li>Hari</li>
        <li>Gita</li>
        <li>Rita</li>
        <li>Ghanshyam</li>
      </ul>
    </div>
  );
};

export default Sidebar;
