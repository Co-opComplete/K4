FROM ubuntu:14.04
MAINTAINER Corey Pauley <cpauleyrun@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# Install curl and other dependencies for our node app
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libssl-dev

# Pull down libevent and install
RUN mkdir -p /usr/src/libevent \
    && curl -SL https://github.com/downloads/libevent/libevent/libevent-2.0.21-stable.tar.gz \
    | tar xvz -C /usr/src/libevent \
    && cd /usr/src/libevent/libevent-2.0.21-stable/ \
    && ./configure \
    && make \
    && make install

# Pull down rfc5766-turn-server and install
RUN mkdir -p /usr/src/rfc5766-turn-server \
    && curl -SL http://turnserver.open-sys.org/downloads/v3.2.4.5/turnserver-3.2.4.5.tar.gz \
    | tar xvz -C /usr/src/rfc5766-turn-server \
    && cd /usr/src/rfc5766-turn-server/turnserver-3.2.4.5/ \
    && ./configure \
    && make \
    && make install

# Get the turnserver keys and config
RUN mkdir -p /usr/local/keys
COPY turnserver.conf /etc/turnserver.conf
COPY turnserverCert.pem /usr/local/keys/turnserverCert.pem

# Expose the turnserver port

CMD ["turnserver", "-r local"]
