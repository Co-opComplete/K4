import os
import yaml
from fabric import api as fab

# Cluster settings
zone = 'us-central1-b'
cluster_name = 'test-cluster'


# {{{ buildImages
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
# }}}


# {{{ up
@fab.task
def up():
    buildImages()
    with fab.settings(warn_only=True):
        workingDir = fab.local('pwd', capture=True)
        # Run the proxy container as a daemon
        fab.local('sudo docker run -itd -p 8000:8000 -v {}/Proxy:/var/www --link mongodb:mongodb --name proxy devspacenine/proxy'.format(workingDir))
# }}}


# {{{ dev
@fab.task
def dev():
    buildImages()
    with fab.settings(warn_only=True):
        workingDir = fab.local('pwd', capture=True)
        # Run the proxy container with a bash prompt
        fab.local('sudo docker run -it -p 8000:8000 -v {}/Proxy:/var/www --link mongodb:mongodb --name proxy devspacenine/proxy bash'.format(workingDir))
# }}}


# {{{ addRobot
@fab.task
def addRobot(dev=False):
    with fab.settings(warn_only=True):
        workingDir = fab.local('pwd', capture=True)

        # Make sure we remove any old containers if they exist
        oldRobotContainers = fab.local("sudo docker ps -a --no-trunc=true | grep -E 'Exited.+robot[0-9]+' | grep -E -o 'robot[0-9]+'", capture=True)
        print oldRobotContainers.split()
        for containerName in oldRobotContainers.split():
            fab.local('sudo docker rm -f {}'.format(containerName))

        # Count the number of running robot containers so we know what to suffix the new name with
        robotContainers = int(fab.local('sudo docker ps -a | grep robot -c', capture=True))

        # Run the client container
        fab.local('sudo docker run -it{} -v {}/LocalControl/websocketClient:/var/www --link proxy:proxy --name robot{} devspacenine/robot-client{}'.format(
            ('' if dev else 'd'),
            workingDir,
            robotContainers + 1,
            (' bash' if dev else '')
        ))
# }}}


# {{{ createCluster
@fab.task
def createCluster():
    with fab.settings(warn_only=True):
        clusters = yaml.load(fab.local('gcloud preview container clusters --zone={} list'.format(zone), capture=True))
        # Only create the cluster if it isn't already there
        if clusters:
            print "Cluster already created"
        else:
            fab.local('gcloud preview container clusters --zone={} create {}'.format(zone, cluster_name))
# }}}


# {{{ deleteCluster
@fab.task
def deleteCluster():
    with fab.settings(warn_only=True):
        clusters = yaml.load(fab.local('gcloud preview container clusters --zone={} list'.format(zone), capture=True))
        # Only try to delete if there are clusters up
        if clusters:
            for cluster in clusters["clusters"]:
                fab.local('gcloud preview container clusters --zone={} delete {}'.format(zone, cluster["name"]))


# {{{ listPods
@fab.task
def listPods():
    with fab.settings(warn_only=True):
        fab.local('gcloud preview container pods --cluster-name={} list --zone={}'.format(cluster_name, zone))
