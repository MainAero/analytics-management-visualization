FROM mongo:latest

MAINTAINER MainAero <mainaero@gmx.de>

# Add nameserver
RUN echo "nameserver 8.8.8.8" | tee /etc/resolv.conf > /dev/null

# Define working directory.
WORKDIR /data
RUN mkdir -p /amazin/resources

RUN apt-get install -y mongodb-org-tools

VOLUME ["/amazin/resources"]

# Define default command.
CMD ["mongod"]

# Expose ports.
#   - 27017: process
#   - 28017: http
#EXPOSE 27017
#EXPOSE 28017