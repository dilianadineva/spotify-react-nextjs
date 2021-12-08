import { atom } from "recoil";

export const currentTrackIdState = atom({ //what track we've currently selected
    key: 'currentTrackIdState', 
    default: 'null'
  });

export const isPlayingState = atom({
key: 'isPlayingState', 
default: 'false' 
});