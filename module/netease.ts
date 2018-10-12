import axios, { AxiosResponse } from 'axios';

import { SONGDOWNLOADURL, SONGLISTURL } from '@config';

import { ISong, IResTrack, INeteasePlaylistDetailRes } from '@model/song';

class Netease {
    public static async playlistDetail(
        id: number,
        start: number,
        length: number,
    ): Promise<ISong[]> {
        const res: AxiosResponse<INeteasePlaylistDetailRes> = await axios.get(SONGLISTURL, {
            params: {
                id,
            },
        });
        return Netease.playlistParse(res.data.result.tracks, start, length);
    }

    public static realTack(id: number): string {
        return `${SONGDOWNLOADURL}${id}.mp3`;
    }

    public static playlistParse(
        tracks: IResTrack[],
        start = 0,
        length = 10,
    ): ISong[] {
        const songs: ISong[] = [];
        tracks.splice(start, length).forEach((track: IResTrack): void => {
            songs.push({
                id: track.id,
                artist: track.artists[0].name,
                pic: track.album.picUrl,
                title: track.name,
                track: Netease.realTack(track.id),
            });
        });
        return songs;
    }
}

export default Netease;
