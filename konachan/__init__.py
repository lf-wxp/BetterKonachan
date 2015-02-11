#!/usr/bin/env python
# coding=utf-8
from flask import Flask
from konachan.view import view


def creat_app(config):
    app = Flask(__name__)
    app.debug = True
    app.config.from_pyfile(config)
    app.jinja_env.variable_start_string = '{{ '#解决angularjs与jinja2 模版冲突
    app.jinja_env.variable_end_string = ' }}'
    app.register_blueprint(view.blueprint)
    return app
