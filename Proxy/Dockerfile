FROM ubuntu:14.04
MAINTAINER Corey Pauley <cpauleyrun@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# Install curl and other dependencies for our node app
RUN apt-get update && apt-get install -y \
    python-software-properties \
    curl \
    gcc \
    supervisor

# Get the node PPA
RUN curl -sL https://deb.nodesource.com/setup | bash -

# Install node
RUN apt-get update && apt-get install -y nodejs

# Install global node packages
RUN npm install -g nodemon bower

# Setup supervisor
RUN mkdir -p /var/log/supervisor

# Cleanup
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    apt-get autoremove -y

# Get the supervisor config file
COPY ./conf/supervisord.conf /etc/supervisor/conf.d/supervisord-K4.conf

EXPOSE 8000

WORKDIR /var/www

VOLUME ["/var/files", "var/www"]

CMD ["/usr/bin/supervisord", "-n"]
