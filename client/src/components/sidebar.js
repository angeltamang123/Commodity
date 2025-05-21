import React from "react";

const Sidebar = () => {
  return (
    <div className="flex flex-col bg-[#960000] -mt-1  font-bold border-r-1 border-black z-10 -mx-1 border-b-slate-400 p-5 justify-start gap-2">
      <p className="font-bold text-md underline underline-offset-4">
        Commodity
      </p>
      <div>
        <ul className="flex flex-col gap-1 mt-3 list-none">
          <li>Ram</li>
          <li>Shyam</li>
          <li>Hari</li>
          <li>Gita</li>
          <li>Rita</li>
          <li>Ghanshyam</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
