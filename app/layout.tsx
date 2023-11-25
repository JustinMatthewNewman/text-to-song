import { getServerSession } from "next-auth";
import Login from "../components/Login/Login";
import SessionProvider from "../components/SessionProvider";
import { authOption } from "../pages/api/auth/[...nextauth]";
import "../styles/globals.css";
import MelodifyNavbar from "@/components/navbar/MelodifyNavbar";
import Providers from "./providers";

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
          <Providers>
            <MelodifyNavbar/>
            {!session ? (
              <Login />
            ) : (
              <div className="flex-col">
                <div
                  className="flex-1 overflow-y"
                >
                  {children}
                </div>
              </div>
            )}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
