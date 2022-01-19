import React from 'react'
import { useRecoilState } from 'recoil'
import { albumIdState, albumImageUrlState, albumNameState } from '../atoms/albumAtom'
import { playlistState } from '../atoms/playlistAtom'


export default function ArtistAlbums({albums}) {
    console.log("artist album component")
    const [albumId, setAlbumId] = useRecoilState(albumIdState)
    const [albumName, setAlbumName] = useRecoilState(albumNameState)
    const [albumImageUrl, setAlbumImageUrl] = useRecoilState(albumImageUrlState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    return (
        <div className="">
            <h3>Albums</h3>
            <div className="flex items-center justify-between ml-auto md:ml-0 flex-wrap">
              {/* {JSON.stringify(albums)} */}
              {albums.map((album) => {
                        if(album.available_markets.indexOf("BG")>=1){ //album.album_type === 'album' && 
                            return(
                                <div className="max-w-xs flex-shrink flex-col my-4"
                                onClick={()=>{
                                    console.log("album id: ", album.id)
                                    setAlbumId(album.id);
                                    setAlbumImageUrl(album.images[0].url);
                                    setAlbumName(album.name);
                                    setPlaylist(null)
                                }}
                                >
                                    <img className="w-18 h-18 py-1 object-contain" 
                                    src={album.images[0].url} alt={album.name} />
                                    <p className=" text-base">
                                        {album.name}
                                        </p>
                                </div>
                            )
                        }
                    })}
            </div>
        </div>
    )
}
