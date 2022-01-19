import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil' 
import { playlistState } from '../atoms/playlistAtom'
import { albumIdState, albumImageUrlState, albumNameState } from '../atoms/albumAtom'
import { artistIdState } from '../atoms/artistAtom'
import Song from './Song'
import useSpotify from '../hooks/useSpotify'
import ArtistAlbums from './ArtistAlbums'

function Songs() {
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [albumTracks, setAlbumTracks] = useState([])
    const [albumsInfo, setAlbumsInfo] = useState([])
    const [albumId, setAlbumId] = useRecoilState(albumIdState)
    const [albumName, setAlbumName] = useRecoilState(albumNameState)
    const [albumImageUrl, setAlbumImageUrl] = useRecoilState(albumImageUrlState)
    const [artistId, setArtistId] = useRecoilState(artistIdState)
    const spotifyApi = useSpotify()
    
    useEffect(()=>{
        if(albumId!==null){
            console.log("album chosen: ", albumId)
            spotifyApi.getAlbumTracks(albumId).then((data)=>{
                setAlbumTracks(data.body.items)
                setPlaylist(null)
            }).catch((err)=>{
                console.log('Something went wrong while fetching album tracks!', err)
            })
        }
    }, [albumId, spotifyApi]) //albumTracks?

    useEffect(() => {
        if (artistId) {
            //Get artist albums by artist id
            setPlaylist(null) //remove playlist songs component
            spotifyApi.getArtistAlbums(artistId).then(
                function (data) {
                    setAlbumsInfo(data.body.items)
                },
                function (err) {
                    console.error(err);
                }
            )
        }
    }, [artistId, spotifyApi])


    return (
        <div className="text-white px-8 flex-col space-y-1 pb-28">
            {albumId!==null && albumTracks.length > 0 && albumTracks.map((track, i) => {
              return (
                <div className="album_song">
                    <Song key={track.id} track={track} albumImageUrl={albumImageUrl} albumId={albumId} albumName={albumName} order={i} />
                </div>
            ) 
            })
            
            }
            {albumId === null && playlist!==null && playlist?.tracks.items.map((track, i)=>{
                return (
                    // albumName={track.track.album.name} albumId={track.track.album.id}
                    <Song key={track.track.id} track={track.track} order={i} />
                )
            })}
            {/* artistId !==null &&  */}
             {albumId === null && playlist === null && (
                 <ArtistAlbums  albums={albumsInfo} />
            )}

        </div>
    )
}

export default Songs
