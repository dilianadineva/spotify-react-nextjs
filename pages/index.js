import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

export default function Home(props) {
  return (
    //className="flex flex-col items-center justify-center min-h-screen py-2"
    <div className="bg-black h-screen overflow-hidden">
      {/* <Head>
        <title>Spotify App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div> 
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: {session} // will be passed to the page component as props
  }
}
