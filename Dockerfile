ARG BUILD_FROM
FROM $BUILD_FROM
FROM %%BASE_IMAGE%%

WORKDIR /usr/src/my_bose_app

ENV LANG C.UTF-8

# Install node.js
RUN apk add --no-cache jq nodejs nodejs-npm git

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]