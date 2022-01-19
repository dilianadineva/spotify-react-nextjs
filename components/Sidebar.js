import React, { useEffect, useState } from 'react'
import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, RssIcon } from '@heroicons/react/outline'
import { HeartIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { playlistIdState } from '../atoms/playlistAtom'
import { albumIdState } from '../atoms/albumAtom'

function Sidebar() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [playlists, setPlaylists] = useState([])
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const [albumId, setAlbumId] = useRecoilState(albumIdState)
    // console.log("playlist id: ", playlistId)
    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => { //use await?
                setPlaylists(data.body.items)
            })
        }else{
        }

    }, [session, spotifyApi])

    const getLikedSongs = () => {
        console.log("getting liked songs")
        spotifyApi.getMySavedTracks({
            limit : 40
          })
          .then(function(data) {
            let likedItems = data.body.items
            // setLikedSongs(likedItems)
            likedItems.map(item => {
                console.log(item.track.name, item.track.artists[0])
            })
          }, function(err) {
            console.log('Something went wrong!', err);
          });
    }

    // console.log(playlists)

    return (
        //by default hidden on mobile 
        <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen hidden sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] pb-36">
            <div className="space-y-4">
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5"/>
                <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5"/>
                <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5"/>
                <p>Your Library</p>
                </button>
                <hr className="border-t-[0.1px] border-green-900"/>

                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5"/>
                <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2  hover:text-white">
                    <HeartIcon className="h-5 w-5 text-blue-500"/>
                <p onClick={()=>{getLikedSongs()}}>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5 text-green-500"/>
                <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-green-900"/>
                {/* Playlists */}
                {playlists.map((playlist)=>{
                    return (
                        <p key = {playlist.id} className="cursor-pointer hover:text-white" 
                        onClick={()=>{
                            setPlaylistId(playlist.id);
                            setAlbumId(null) //deselect album
                        }}>
                            {playlist.name}
                        </p>
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar
