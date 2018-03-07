const axios = require('axios');
const baseUrl = 'http://music.163.com/song/media/outer/url?id=';
class Netease {
    playlist_detail(id) {
        return axios.get('http://music.163.com/api/playlist/detail', {
            params: {
                id: id
            }
        })
            .then((res) => {
                return this.playlist_parse(res.data.result.tracks);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    realTack(id) {
        return `${baseUrl}${id}.mp3`;
    }
    playlist_parse(tracks) {
        let songs = [];
        tracks.forEach((track) => {
            songs.push({
                id: track.id,
                track: this.realTack(track.id),
                title: track.name,
                pic: track.album.picUrl,
                artist: track.artists[0].name
            })
        });
        return songs;
    }
}

module.exports = Netease
