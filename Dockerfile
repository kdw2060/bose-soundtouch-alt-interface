ARG BUILD_FROM
FROM node:carbon

WORKDIR /usr/src/MyBoseApp

ENV LANG C.UTF-8

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]