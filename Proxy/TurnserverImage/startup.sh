#!/bin/bash

publicIp=`curl ipecho.net/plain`
echo public IP = $publicIp
sed -i "s/^#external-ip=XXX.XXX.XXX.XXX/external-ip=$publicIp/" /etc/turnserver.conf
sed -i "s/^#TURNSERVER_ENABLED.*/TURNSERVER_ENABLED=1/" /etc/default/rfc5766-turn-server
service rfc5766-turn-server start
