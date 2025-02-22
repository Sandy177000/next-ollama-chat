import { AppProps } from "next/app"
import "./../globalStyles.css"

function MyApp({Component,pageProps}:AppProps) {
  return (
    <Component {...pageProps}/>
  )
}

export default MyApp