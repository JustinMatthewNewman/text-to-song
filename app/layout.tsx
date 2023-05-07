import ClientProvider from "@/components/ClientProvider";
import { getServerSession } from "next-auth";
import Login from "../components/Login";
import SessionProvider from "../components/SessionProvider";
import Sidebar from "../components/Sidebar";
import { authOption } from "../pages/api/auth/[...nextauth]";
import "../styles/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOption);

  return (
    <html lang="en">
      <head />
      <body>
        <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : (
            <div className="flex">
              <div style={{ background: 'linear-gradient(45deg, rgba(65,88,208,1) 0%, rgba(200,80,192,1) 51%, rgba(255,204,112,1) 51%, rgba(255,112,217,1) 51%, rgba(255,204,112,1) 100%)' }} className="max-w-xs h-screen overflow-y-auto md:min-w-[20rem]">
                <Sidebar />
              </div>
              <ClientProvider />
              <div className="flex-1 overflow-y" style={{ background: 'linear-gradient(225deg, rgba(65,88,208,1) 0%, rgba(200,80,192,1) 51%, rgba(255,204,112,1) 51%, rgba(255,112,217,1) 51%, rgba(255,204,112,1) 100%)' }}>{children}</div>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
