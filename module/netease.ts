import axios from 'axios';

class Netease {
    public static async playlistDetail(id) {
        const res = await axios.get('http://music.163.com/api/playlist/detail', {
            params: {
                id,
            },
        });
        return Netease.playlistParse(res.data.result.tracks);
    }
    public static playlistParse(tracks) {
        const songs = [];
        tracks.forEach((track) => {
            songs.push({
                artist: track.artists[0].name,
                pic: track.album.picUrl,
                title: track.name,
                track: track.mp3Url,
            });
        });
        return songs;
    }
}

export default Netease;
