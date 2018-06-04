import Nestease from '../modules/netease';
import axios from 'axios';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

const basePath = path.resolve(__dirname, '../media');

const [start = 0, length = 10] = process.argv.slice(2).map( x => ~~x);

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
}

const outFile = fs.createWriteStream(path.resolve(basePath, 'media.zip'));
const archive = archiver('zip', {
    zlib: {
        level: 9,
    },
});
archive.pipe(outFile);

Nestease.playlistDetail(95815468, start, length).then( async data => {
    archive.append(JSON.stringify(data), { name: 'data.json' });
    for (const { track, id } of data) {
        const res = await axios.get(track, {
            responseType: 'stream',
        });
        archive.append(res.data, { name: `${id}.mp3`});
    }
    archive.finalize();
});

