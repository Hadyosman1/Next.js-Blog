import React from "react";
import SideBar from "./SideBar";

import { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { redirect } from "next/navigation";
import DashboardTemplate from "./template";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const token = cookies().get("jwt_token")?.value;
  const userFromToken = verifyTokenForPage(token ?? "");

  if (!userFromToken?.isAdmin || !token) return redirect("/");

  return (
    <div className="grid max-h-[calc(100dvh_-_140px)] grid-cols-[auto_1fr] overflow-hidden sm:max-h-[calc(100dvh_-_116px)] md:max-h-[calc(100dvh_-_123.5px)]">
      <SideBar />

      <DashboardTemplate key={"dashboard_template"}>
        {children}
      </DashboardTemplate>
    </div>
  );
};

export default DashboardLayout;

export const metadata: Metadata = {
  title: "Dashboard |",
  description: "Admin Dashboard",
};
