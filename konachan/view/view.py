from flask import render_template, Blueprint, jsonify, request, abort
from flask.ext.restful import Api, Resource, reqparse
from datetime import datetime
from bs4 import BeautifulSoup
import simplejson as json
import time
import requests
import math
import re
import base64
blueprint = Blueprint('view', __name__, template_folder='templates')
URL = "http://konachan.com/post.xml?page="
PERPAGE = 21
TIMEOUT = 180
# rating  safe questionable explicit


@blueprint.route('/')
def index():
    return render_template('index.html')
@blueprint.route('/setting')
def setting():
    return index()


class postParams:

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('page', type=str, help="NO username")


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


class postAPI(Resource, postParams):

    """docstring for userAPI"""

    def post(self):
        pass

    def get(self):
        isSafe = request.args.get('isSafe', 'false')
        page = int(request.args.get('page', 1))
        try:
            r = requests.get(URL + str(page), timeout=TIMEOUT).text
        except Exception:
            return {"success": "false", "reason": "timeout"}
        bs = BeautifulSoup(r, 'lxml')
        imgs = bs.find_all('post')
        posts = bs.find("posts")
        count = math.ceil(int(posts['count']) / 21)
        if page > count:
            return {"success": "false", "reason": "out of range"}
        data = {"pages": count, "images": []}
        reg = re.compile(r'http://.+\.(jpg|png|jpeg)')
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
                    data['images'].append(
                        {"url": url, "prev_url": prev_url, "sample": sample, "sample_height": sample_height, "sample_width": sample_width, "name": md5 + "." + filetype, "width": width, "height": height})
            return data
api = Api(blueprint)
api.add_resource(postAPI, "/post", endpoint="post")
api.add_resource(picAPI, "/pic", endpoint="pic")
