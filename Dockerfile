ARG BUILD_FROM
FROM $BUILD_FROM
ENV LANG C.UTF-8

# Install node.js
RUN apk add --no-cache nodejs nodejs-npm

# Create app directory
WORKDIR /data/my_bose_app

# Copy data for add-on
COPY package.json .
COPY . .
COPY client .

EXPOSE 3001

COPY run.sh /data/my_bose_app
RUN chmod a+x /data/my_bose_app/run.sh
CMD [ "/data/my_bose_app/run.sh" ]