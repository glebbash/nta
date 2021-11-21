import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className='h-screen'>
      <Head>
        <title>NTA</title>
      </Head>

      <main className="flex h-full">
        <div className="w-1/4 h-full bg-gray-700">Drawer</div>
        <div className="w-full h-full bg-gray-500">Main</div>
      </main>
    </div>
  )
}

export default Home
