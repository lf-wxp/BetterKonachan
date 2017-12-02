"""
WSGI config for project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""

import os
from konachan import creat_app
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
application = creat_app('config.py')
