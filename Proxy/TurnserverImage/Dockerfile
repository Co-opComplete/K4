FROM ubuntu:14.04
MAINTAINER Corey Pauley <cpauleyrun@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# Install curl and other dependencies for our node app
RUN apt-get update && apt-get install -y \
    curl \
    rfc5766-turn-server

# Get the turnserver keys and config
RUN mkdir -p /usr/local/keys
COPY turnserver.conf /etc/turnserver.conf
COPY turnserverCert.pem /usr/local/keys/turnserverCert.pem

ADD . /src

# Expose the turnserver port
Expose 8001

CMD ["/bin/bash", "/src/startup.sh"]
