import React, { useEffect, useState } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import { albumIdState, albumImageUrlState, albumNameState } from '../atoms/albumAtom'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { artistIdState } from '../atoms/artistAtom'
import useSpotify from '../hooks/useSpotify'
import {millisToMinutesAndSeconds} from '../lib/time'

function Song({track, order}) {
    console.log("Song component")

    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [albumId, setAlbumId] = useRecoilState(albumIdState)
    const [albumName, setAlbumName] = useRecoilState(albumNameState)
    const [albumImageUrl, setAlbumImageUrl] = useRecoilState(albumImageUrlState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [artistId, setArtistId] = useRecoilState(artistIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    
//needed data: id, uri, album image url, name, artist name, album id, album name, duration_ms

    const playSong = () => {
        setCurrentTrackId(track.id)
        setIsPlaying(true)
        spotifyApi.play({
            uris: [track.uri]
        }, function(err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            if(err){
                console.log('Something went wrong!', err);
            }
          })
    }

    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 cursor-pointer">
            <div className="flex items-center space-x-4" onClick={playSong}>
                <p>{order+1}</p>
                <img className="w-10 h-10" src={track.album?.images[0]?.url ? track.album?.images[0]?.url : albumImageUrl} />
                <div>
                    <p className="w-36 lg:w-64 truncate text-white">{track.name}</p>
                    <p className="w-40 hover:underline" onClick={() => {setArtistId(track.artists[0].id); console.log("settin artist id")}} >
                        {track.artists[0].name}
                        </p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="hidden md:inline w-40 hover:underline"
                onClick={()=>{
                    // console.log("album id: ", track.album.id)
                    setAlbumId(track.album?.id ? track.album?.id : albumId ); 
                    setAlbumName(track.album?.name ? track.album?.name : albumName); 
                    setAlbumImageUrl(track.album?.images[0]?.url ? track.album?.images[0]?.url : albumImageUrl)
                }}
                >{track.album?.name ? track.album.name : albumName}</p>
                <p>
                    {millisToMinutesAndSeconds(track.duration_ms)}
                    </p>
            </div>
        </div>
    )
}

export default Song
