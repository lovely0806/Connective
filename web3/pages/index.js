import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useSelector} from "react-redux";


export default function Home() {
  const { user} = useSelector(
    (state) => state.auth
  );

  return (
    <div>
      <Head>
        <title>Connective</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      main page
    </div>
  )
}
