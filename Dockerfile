ARG BUILD_FROM
FROM $BUILD_FROM

WORKDIR /data


ENV LANG C.UTF-8

# Install node.js
RUN apk add --no-cache jq nodejs nodejs-npm git

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]