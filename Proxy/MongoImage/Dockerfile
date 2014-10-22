FROM ubuntu:14.04
MAINTAINER Corey Pauley <cpauleyrun@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# Add mongo to the repository list and add its key
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list

# Install mongodb
RUN apt-get update && apt-get install -y \
    mongodb-org

# Create the default data directory
RUN mkdir -p /data/db

# Expose default ports
EXPOSE 27017

# Start mongo
CMD ["/usr/bin/mongod"]
