import { HeartIcon, ReplyIcon, VolumeUpIcon as VolumeDownIcon} from '@heroicons/react/outline'
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon, VolumeUpIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'

function Player() {
    const spotifyApi=useSpotify()
    const { data: session, status } = useSession()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)
    const songInfo = useSongInfo()
    // console.log("song info: ", songInfo)

    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack()
            .then(data => {
                console.log("Now playing: ", data.body?.item)
                setCurrentTrackId(data.body?.item?.id)

                spotifyApi.getMyCurrentPlaybackState()
                .then((data) => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause()
                setIsPlaying(false)
            } else {
                spotifyApi.play()
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            //fetch song info
            fetchCurrentSong()
            setVolume(50)
        }
    }, [currentTrackIdState, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume])

    const debouncedAdjustVolume = useCallback(
        debounce(volume => {
            //implement check for an active device
            spotifyApi.setVolume(volume)
                .catch(err => {
                    console.log("spotifyApi.setVolume error: ", err)
                })
        }, 350),
        [] //dependancy array
    )

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                    <img className={`hidden md:inline ${songInfo?.album?.images?.[0]?.url ? "h-10 w-10" : ""}`}
                src={songInfo?.album?.images?.[0]?.url} alt={songInfo?.name} />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                    
                </div>
            </div>
            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" 
                onClick={()=> spotifyApi.skipToPrevious()}
                />
                {
                    isPlaying? (
                        <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
                    ) : (
                        <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
                    )
                }
                <FastForwardIcon className="button"
                onClick={()=> spotifyApi.skipToNext()}
                />
                <ReplyIcon className="button" />
            </div>
            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon 
                onClick={() => {
                    volume > 0 && setVolume(volume - 10)
                }} 
                className="button"/>
                <input className="w-14 md:w-28" type="range" value={volume} min={0} max={100} 
                onChange={e => setVolume(Number(e.target.value))}
                />
                <VolumeUpIcon 
                onClick={() => {
                    volume < 100 && setVolume(volume + 10)
                }} 
                className="button"/>
            </div>
        </div>
    )
}

export default Player