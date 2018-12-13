export interface ISong {
    id: number;
    artist: string;
    pic: string;
    title: string;
    track: string;
}

export interface ITrackArtist {
    name: string;
    id: number;
    picId: number;
    img1v1Id: number;
    briefDesc: string;
    picUrl: string;
    img1v1Url: string;
    albumSize: number;
    alias: string[];
    trans: string;
    musicSize: number;
}

export interface ITrackSong {
    name: string;
    id: number;
    size: number;
    extension: string;
    sr: number;
    dfsId: number;
    bitrate: number;
    playTime: number;
    volumeDelta: string;
    dfsId_str: string;
}

export interface IAlbum {
    name: string;
    id: number;
    // tslint:disable no-reserved-keywords
    type: string;
    size: number;
    picId: number;
    blurPicUrl: string;
    companyId: number;
    pic: number;
    picUrl: string;
    publishTime: number;
    description: string;
    tags: string;
    company: string;
    briefDesc: string;
    artists: ITrackArtist;
    songs: ITrackSong[];
    alias: string[];
    status: number;
    copyrightId: number;
    commentThreadId: string;
    subType: string;
    transName: string;
    picId_str: number;
    transNames: string[];
}

export interface IResTrack {
    name: string;
    id: number;
    position: number;
    alias: string[];
    status: number;
    fee: number;
    copyrightId: number;
    disc: number;
    no: number;
    artists: ITrackArtist[];
    album: IAlbum;
    starred: boolean;
    popularity: number;
    score: number;
    starredNum: number;
    duration: number;
    playedNum: number;
    dayPlays: number;
    hearTime: number;
    ringtone: string;
    crbt: string;
    audition: string;
    copyFrom: string;
    commentThreadId: string;
    rtUrl: string;
    ftype: number;
    rtUrls: string[];
    copyright: number;
    transName: string;
    sign: string;
    hMusic: ITrackSong;
    mMusic: ITrackSong;
    lMusic: ITrackSong;
    bMusic: ITrackSong;
    rtype: number;
    rurl: string;
    mvid: number;
    mp3Url: string;
    transNames: string[];
}

export interface INeteasePlaylistDetailRes {
    result: {
        [key: string ]: string | string[] | IResTrack[];
        tracks: IResTrack[];
    };
}
