# Use nodejs argon base file
FROM node:argon

MAINTAINER MainAero <mainaero@gmx.de>

# Add nameserver
RUN echo "nameserver 8.8.8.8" | tee /etc/resolv.conf > /dev/null

# Create  directory
RUN mkdir -p /amazin/management-tool

# Install Nginx.
RUN \
  apt-get update && \
  apt-get install -y nginx && \
  rm -rf /var/lib/apt/lists/* && \
  chown -R www-data:www-data /var/lib/nginx

# Add api files
ADD . /amazin/management-tool

RUN cd /amazin/management-tool && npm update && npm install \
    && npm install -g bower && npm install -g grunt-cli \
    && bower install --allow-root && grunt build

ADD nginx.conf /etc/nginx/nginx.conf
RUN service nginx stop

# Expose mountable volume, if needed
VOLUME ["/amazin/management-tool"]

# Define working directory.
WORKDIR /amazin/management-tool

# Expose ports
EXPOSE 80
EXPOSE 443


# Define default command.
ENTRYPOINT ["nginx"]