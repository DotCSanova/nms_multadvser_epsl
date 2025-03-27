FROM node:20.5.0-alpine3.18
RUN addgroup nodeapp && adduser -S -G nodeapp nodeapp
USER nodeapp
WORKDIR /app/
COPY --chown=nodeapp package*.json .
RUN npm install
USER root
RUN apk add --no-cache ffmpeg
RUN cp /usr/bin/ffmpeg /app/ffmpeg && \
    chown nodeapp:nodeapp /app/ffmpeg && \
    chmod +x /app/ffmpeg
USER nodeapp
COPY --chown=nodeapp . .
EXPOSE 3000
CMD ["npm", "start"]