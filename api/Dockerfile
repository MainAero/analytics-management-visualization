# Use nodejs argon base file
FROM node:argon

MAINTAINER MainAero <mainaero@gmx.de>

# Create pid directory
RUN mkdir -p /amazin/api/pid

# Add api files
ADD . /amazin/api
RUN chmod +x /amazin/api/start.sh

WORKDIR /amazin/api

# Add nameserver
RUN echo "nameserver 8.8.8.8" | tee /etc/resolv.conf > /dev/null

RUN npm update && npm install

# Expose mountable volume, if needed
VOLUME ["/amazin/api"]

# Expose api port
EXPOSE 3000

# Define docker entrypoint
ENTRYPOINT ["/amazin/api/start.sh"]