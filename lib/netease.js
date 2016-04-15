const axios = require('axios');
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
    playlist_parse(tracks) {
        let songs = [];
        tracks.forEach((track) => {
            songs.push({
                track: track.mp3Url,
                title: track.name,
                pic: track.album.picUrl,
                artist: track.artists[0].name
            })
        });
        return songs;
    }
}

module.exports = Netease