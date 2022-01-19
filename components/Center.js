import { ChevronDownIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistState, playlistIdState } from '../atoms/playlistAtom'
import React, { useEffect, useState } from 'react'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

function Center() {
    const {data: sessionData} = useSession() //rename it as sessionData
    const spotifyApi = useSpotify()
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    // const [likedSongs, setLikedSongs] = useState(null)

    useEffect(()=>{
        spotifyApi.getPlaylist(playlistId).then((data)=>{
            setPlaylist(data.body)
        }).catch((err)=>{
            console.log("spotifyApi getPlaylist error", err)
        })
    }, [spotifyApi, playlistId])
    
    // console.log("playlist: ", playlist)

    return (
        <div className="flex-grow text-white col-span-full h-screen overflow-y-scroll scrollbar-hide">
           <header className="absolute top-5 right-8">
               <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2" onClick={()=>{signOut()}}>
                   <img 
                   className=" rounded-full w-10 h-10"
                   src={sessionData?.user?.image} alt={sessionData?.user?.name}/>
                   <h2>{sessionData?.user?.name}</h2>
                   <ChevronDownIcon className="h-5 w-5"/>
               </div>
           </header>
           <section className={`flex-items-end space-x-7 bg-gradient-to-b to-black from-green-500 h-80 text-white p-8`}>
               <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt={playlist?.name} />
               <div>
                   <p>
                       PLAYLIST
                   </p>
                   <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                   {playlist?.name}
                   </h1>
               </div>
           </section>
           <div>
               <Songs />
           </div>
        </div>
    )
}

export default Center
