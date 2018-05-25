import axios from 'axios';
class Netease {
    public static baseUrl = 'http://music.163.com/song/media/outer/url?id=';
    public static async playlistDetail(id) {
        const res = await axios.get('http://music.163.com/api/playlist/detail', {
            params: {
                id,
            },
        });
        return Netease.playlistParse(res.data.result.tracks);
    }
    public static realTack(id: number) {
        return `${Netease.baseUrl}${id}.mp3`;
    }
    public static playlistParse(tracks) {
        const songs = [];
        tracks.splice(0, 50).forEach((track) => {
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
