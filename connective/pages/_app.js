import "../styles/globals.css";
import {creatorMaker} from "components/creator-maker/index"

if(typeof window !== "undefined")
{
    creatorMaker()
}
function MyApp({ Component, pageProps }) {
  return (
      <Component {...pageProps} />
  )
}
export default MyApp;