from fabric import api as fab


def up():
    # Build the Proxy image
    with fab.lcd('./Proxy'):
        fab.local('docker build -t devspacenine/k4-proxy .')

    # Build the MongoDB image
    with fab.lcd('./Proxy/MongoImage'):
        fab.local('docker build -t devspacenine/k4-db .')

    # Pull the Turn server image
    with fab.lcd('./Proxy/TurnserverImage'):
        fab.local('docker pull connectify/turnserver .')
