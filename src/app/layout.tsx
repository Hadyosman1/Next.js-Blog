import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";

// libraries
import { ToastContainer } from "react-toastify";

//styles
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

//components
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import OpenAddArticleModalBtn from "@/components/Articles/OpenAddArticleModalBtn";
import PagesWrapper from "@/components/PagesWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s DEVO",
    default: "DEVO",
  },
  description: "Small Social Media Web App.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = cookies().get("jwt_token")?.value;
  const user = verifyTokenForPage(token || "");

  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="modal-container"></div>

        <ToastContainer draggablePercent={60} theme="colored" />

        <div className="mx-auto flex min-h-svh flex-col">
          {user && <OpenAddArticleModalBtn />}

          <Header user={user} />

          <PagesWrapper className="grid flex-grow bg-slate-200/70">
            {children}
          </PagesWrapper>

          <Footer />
        </div>
      </body>
    </html>
  );
}
