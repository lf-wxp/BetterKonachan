from flask import render_template, Blueprint, jsonify, request, abort
from flask.ext.restful import Api, Resource, reqparse
from datetime import datetime
from bs4 import BeautifulSoup
import simplejson as json
import time
import requests
import math
import re
blueprint = Blueprint('view', __name__, template_folder='templates')
URL = "http://konachan.com/post.xml?page="
PERPAGE = 21
# rating  safe questionable explicit


@blueprint.route('/')
def index():
    return render_template('index.html')


class postParams:

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('page', type=str, help="NO username")


class postAPI(Resource, postParams):

    """docstring for userAPI"""

    def post(self):
        pass

    def get(self):
        isSafe = request.args.get('isSafe', 'false')
        page = int(request.args.get('page', 1))
        try:
            r = requests.get(URL + str(page), timeout=180).text
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
                    md5 = img['md5']
                    filetype = re.findall(reg, url)[0]
                    width = img['width']
                    height = img['height']
                    data['images'].append(
                        {"url": url, "prev_url": prev_url, "name": md5 + "." + filetype, "width": width, "height": height})
            return data
api = Api(blueprint)
api.add_resource(postAPI, "/post", endpoint="post")
