import { TableDemo } from "@/demo/admin-dashboard/TableDemo";
import React from "react";

const page = () => {
  return (
    <div className="w-[1000px] grid grid-cols-1 space-y-5 p-20">
      <p className="font-bold text-4xl">Manage Appointments</p>
      <TableDemo />
    </div>
  );
};

export default page;
