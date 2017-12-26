ARG BUILD_FROM
FROM node:carbon

WORKDIR /usr/src/my_bose_app

ENV LANG C.UTF-8

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]