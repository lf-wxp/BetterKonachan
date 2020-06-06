import axios, { AxiosResponse } from 'axios';
import { SONGDOWNLOADURL, SONGLISTURL } from '~config';
import { ISong, IResTrack, INeteasePlaylistDetailRes } from '~model/song';

export namespace Netease {
    export async function playlistDetail(
        id: number,
        start: number,
        length: number
    ): Promise<ISong[]> {
        const res: AxiosResponse<INeteasePlaylistDetailRes> = await axios.get(
            SONGLISTURL,
            {
                params: {
                    id
                }
            }
        );

        return playlistParse(res.data.result.tracks, start, length);
    }

    export function realTack(id: number): string {
        return `${SONGDOWNLOADURL}${id}.mp3`;
    }

    export function playlistParse(
        tracks: IResTrack[],
        start: number = 0,
        length: number = 10
    ): ISong[] {
        const songs: ISong[] = [];
        tracks.splice(start, length).forEach((track: IResTrack): void => {
            songs.push({
                id: track.id,
                artist: track.artists[0].name,
                pic: track.album.picUrl,
                title: track.name,
                track: Netease.realTack(track.id)
            });
        });

        return songs;
    }
}
