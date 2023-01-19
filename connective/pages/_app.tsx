import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { creatorMaker } from "../components/creator-maker";

if (typeof window !== "undefined") {
  creatorMaker();
}
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
export default MyApp;
