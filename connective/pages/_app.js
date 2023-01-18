import "../styles/globals.css";
import { creatorMaker } from "components/creator-maker/index";
import { SessionProvider } from "next-auth/react";

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
