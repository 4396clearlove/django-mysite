#-*- coding:utf8 -*-
"""
Django settings for mysite_tz project.

Generated by 'django-admin startproject' using Django 1.8.8.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os, platform

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LOG_DIR = os.path.join(BASE_DIR,'log')  #自定义的日志文件夹

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'tn05m059)sq)7ye82_+3j868rb@7tilqjr+4bz$%rcq!j7&625'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1','localhost']

ZTREE_JSON = os.path.join(BASE_DIR, "trans_book/static/ztree/ztreeNode.json")

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'netopo',
    'cable',
    'flow_monitor',
    'odf_pic'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'mysite_tz.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mysite_tz.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'default.sqlite3'),
    },
    'netopo': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'netopo.sqlite3'),
    },
    'cable': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'cable.sqlite3'),
    },
    'flow_monitor':{
        'ENGINE': 'sql_server.pyodbc',
        'NAME': 'yunwei',
        'HOST': '10.117.193.233',
        'USER': 'zhongpeihong',
        'PASSWORD': 'Unicom2015',
    },
    'odf_pic':{
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'odf.sqlite3'),
    }
}

if platform.system()=='Linux':
        DATABASES['flow_monitor']['OPTIONS'] = {
            'dsn': 'MyDSN'
        }


DATABASE_ROUTERS = ['mysite_tz.db_route.Router']
#db_route.py与settings.py放在一个文件夹

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = False  #不开启时区


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/
STATIC_ROOT = 'server_static/static'   #命令python manage.py collectstatic会把所有静态文件保存在这里

STATIC_URL = '/static/'     #'django.contrib.staticfiles'只会搜索每个app中的static文件夹，不会搜索主目录的static文件夹

MEDIA_URL = "/"

# Default settings

STATICFILES_DIRS = [
os.path.join(BASE_DIR, "static"),
]

# if platform.system()=='Windows':
#     LOGGING = {
#         'version': 1,
#         'disable_existing_loggers': False,
#         'handlers': {
#             'console': {
#                 'class': 'logging.StreamHandler',
#             },
#         },
#         'loggers': {
#             'django.db.backends': {
#                 'handlers': ['console'],
#                 'level': 'DEBUG' if DEBUG else 'INFO',
#             },
#         },
#     }