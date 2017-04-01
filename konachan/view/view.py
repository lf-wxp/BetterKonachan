from flask import render_template, Blueprint, jsonify, request, abort
from flask.ext.restful import Api, Resource, reqparse
from datetime import datetime
from bs4 import BeautifulSoup
from random import choice
from .netease import NetEase
import simplejson as json
import time
import requests
import math
import re
import base64
# for development
# from flask.ext.cors import CORS
blueprint = Blueprint('view', __name__, template_folder='templates')
# CORS(blueprint)
URL = "http://konachan.net/post.xml?page="
PERPAGE = 21
TIMEOUT = 180
# rating  safe questionable explicit
myMusic = NetEase()


@blueprint.route('/music')
def music():
    songs = []
    data = myMusic.playlist_detail(95815468)
    for song in data:
        songs.append({'track': song['mp3Url'], 'title': song['name'], 'pic': song[
                     'album']['picUrl'], 'artist': song['artists'][0]['name']})
    return json.dumps(songs)


@blueprint.route('/')
def index():
    return render_template('index.html')


@blueprint.app_errorhandler(404)
def error(error):
    return index()


def getXmlData(isSafe, page, tags=""):
    try:
        r = requests.get(URL + str(page) + '&tags=' +
                         tags, timeout=TIMEOUT).text
    except Exception:
        return {"success": "false", "reason": "timeout", "timeOut": "true"}
    bs = BeautifulSoup(r, 'lxml')
    imgs = bs.find_all('post')
    posts = bs.find("posts")
    count = math.ceil(int(posts['count']) / 21)
    if count == 0:
        return {"success": "false", "reason": "no result", "noResult": "true"}
    if page > count:
        return {"success": "false", "reason": "out of range", "outRange": "true"}
    data = {"pages": count, "images": []}
    reg = re.compile(r'//.+\.(jpg|png|jpeg|gif|svg|bmp|webp|bpg)')
    if len(imgs):
        for img in imgs:
            rating = img['rating']
            if not isSafe == 'true' or rating == 's':
                url = img['file_url']
                prev_url = img['preview_url']
                sample = img['sample_url']
                sample_height = img['sample_height']
                sample_width = img['sample_width']
                md5 = img['md5']
                filetype = re.findall(reg, url)[0]
                width = img['width']
                height = img['height']
                preview_width = img['actual_preview_width']
                preview_height = img['actual_preview_height']
                data['images'].append(
                    {"url": url, "prev_url": prev_url, "sample": sample, "sample_height": sample_height, "sample_width": sample_width, "name": md5 + "." + filetype, "width": width, "height": height, 'preview_width': preview_width, 'preview_height':preview_height})
        return data


class postParams:

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('page', type=str, help="NO username")
        self.reqparse.add_argument('tags', type=str, help="NO tags")


class picParams:

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('url', type=str, help="NO picture url")


class picAPI(Resource, picParams):

    """docstring for picAPI"""

    def post(self):
        args = self.reqparse.parse_args()
        img = requests.get(args['url'])
        encodedata = base64.b64encode(img.content).decode('utf-8')
        data_url = 'data:image/jpg;base64,{}'.format(encodedata)
        return {'data_url': data_url}

    def get(self):
        isSafe = 'true'
        page = 1
        data = getXmlData(isSafe, page)
        cover = choice(data['images'])['sample']
        img = requests.get(cover)
        encodedata = base64.b64encode(img.content).decode('utf-8')
        data_url = 'data:image/jpg;base64,{}'.format(encodedata)
        return data_url


class postAPI(Resource, postParams):

    """docstring for userAPI"""

    def post(self):
        pass

    def get(self):
        isSafe = request.args.get('isSafe', 'false')
        page = int(request.args.get('page', 1))
        tags = request.args.get('tags', '')
        return getXmlData(isSafe, page, tags)

api = Api(blueprint)
api.add_resource(postAPI, "/post", endpoint="post")
api.add_resource(picAPI, "/pic", endpoint="pic")
