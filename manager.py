#!/usr/bin/env python
# coding=utf-8

from flask.ext.script import Manager, Server
from konachan import creat_app
server = Server(port=8000)
manager = Manager(creat_app('config.py'))
manager.add_command("runserver", server)
if __name__ == "__main__":
    manager.run()
