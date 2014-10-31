import os
from fabric import api as fab
# from fabric.utils import puts


def buildImages():
    with fab.settings(warn_only=True):
        # Build the Proxy image
        with fab.lcd('./Proxy'):
            fab.local('sudo docker build -t devspacenine/proxy .')
            fab.local('npm update')
            fab.local('bower update')

        # Build the MongoDB image
        with fab.lcd('./Proxy/MongoImage'):
            fab.local('sudo docker build -t devspacenine/mongo .')

        # Add the data directory if it doesn't exist
        if not os.path.exists('data'):
            os.makedirs('data')

        # Build the turnserver image
        with fab.lcd('./Proxy/TurnserverImage'):
            fab.local('sudo docker build -t devspacenine/turnserver .')

        # Build the robot client image
        with fab.lcd('./LocalControl/websocketClient'):
            fab.local('sudo npm update')
            fab.local('sudo docker build -t devspacenine/robot-client .')

        # Pull the Turn server image
        fab.local('sudo docker pull connectify/turnserver')

        workingDir = fab.local('pwd', capture=True)
        # puts('Working Directory: {}'.format(workingDir))

        # Make sure we remove any old containers if they exist
        mongoContainer = fab.local('sudo docker ps -a | grep mongodb', capture=True)
        if mongoContainer:
            fab.local('sudo docker rm -f mongodb')

        proxyContainer = fab.local('sudo docker ps -a | grep proxy', capture=True)
        if proxyContainer:
            fab.local('sudo docker rm -f proxy')

        turnserverContainer = fab.local('sudo docker ps -a | grep turnserver', capture=True)
        if turnserverContainer:
            fab.local('sudo docker rm -f turnserver')

        # Run the mongo container
        fab.local('sudo docker run -itd -p 27017 -v {}/data:/data/db --name mongodb devspacenine/mongo'.format(workingDir))

        # Run the turnserver container
        fab.local('sudo docker run -itd -p 8001 --name turnserver devspacenine/turnserver')


def up():
    buildImages()
    with fab.settings(warn_only=True):
        workingDir = fab.local('pwd', capture=True)
        # Run the proxy container as a daemon
        fab.local('sudo docker run -itd -p 8000:8000 -v {}/Proxy:/var/www --link mongodb:mongodb --name proxy devspacenine/proxy'.format(workingDir))


def dev():
    buildImages()
    with fab.settings(warn_only=True):
        workingDir = fab.local('pwd', capture=True)
        # Run the proxy container with a bash prompt
        fab.local('sudo docker run -it -p 8000:8000 -v {}/Proxy:/var/www --link mongodb:mongodb --name proxy devspacenine/proxy bash'.format(workingDir))


def addRobot():
    with fab.settings(warn_only=True):
        workingDir = fab.local('pwd', capture=True)

        # Make sure we remove any old containers if they exist
        robotContainers = int(fab.local('sudo docker ps -a | grep robot-client -c', capture=True))
        print robotContainers

        # Run the client container
        fab.local('sudo docker run -it -v {}/LocalControl/websocketClient:/var/www --link proxy:proxy --name robot{} devspacenine/robot-client bash'.format(workingDir, robotContainers + 1))
