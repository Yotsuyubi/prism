import os
from minio import Minio
import urllib.request
import json
import threading
import io


MINIO_ACCESS_KEY = os.environ['MINIO_ACCESS_KEY']
MINIO_SECRET_KEY = os.environ['MINIO_SECRET_KEY']
MINIO_HOST = os.environ['MINIO_HOST']
MINIO_PORT = os.environ['MINIO_PORT']
MINIO_BUCKET = os.environ['MINIO_BUCKET']

API_HOST = os.environ['API_HOST']
API_PORT = os.environ['API_PORT']

WEB_HOST = os.environ['WEB_HOST']
WEB_PORT = os.environ['WEB_PORT']


client = Minio(
    "{}:{}".format(MINIO_HOST, MINIO_PORT),
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)


def pull_cue():
    url = 'http://{}:{}/api/cues/pull'.format(WEB_HOST, WEB_PORT)
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as res:
        body = res.read()
    return body.decode()

def get_info(id):
    url = 'http://{}:{}/api/collections/{}/status'.format(WEB_HOST, WEB_PORT, id)
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as res:
        j = json.load(res)
    return j

def processing(id):
    url = 'http://{}:{}/api/collections/{}/processing'.format(WEB_HOST, WEB_PORT, id)
    req = urllib.request.Request(url, method="PUT")
    with urllib.request.urlopen(req) as res:
        j = json.load(res)
    return j

def finish(id):
    url = 'http://{}:{}/api/collections/{}/finished'.format(WEB_HOST, WEB_PORT, id)
    req = urllib.request.Request(url, method="PUT")
    with urllib.request.urlopen(req) as res:
        j = json.load(res)
    return j

def separate(ytid):
    url = 'http://{}:{}/separate/{}'.format(API_HOST, API_PORT, ytid)
    req = urllib.request.Request(url, method="POST")
    with urllib.request.urlopen(req) as res:
        data = res.read()
    return data

def put_zip(data, id):
    result = client.put_object(
        MINIO_BUCKET, id, io.BytesIO(data), length=len(data),
    )
    return result



def main():

    cue = pull_cue()

    if cue != 'null':
        id = cue[1:-1]
        result = run(id)
        print(
            "created {0} object; etag: {1}, version-id: {2}".format(
                result.object_name, result.etag, result.version_id,
            ),
        )

    threading.Timer(5.0, main).start()


def run(id):
    processing(id)
    ytid = get_info(id)["ytid"]
    data = separate(ytid)
    res = put_zip(data, id)
    finish(id)
    return res


if __name__ == "__main__":
    main()
