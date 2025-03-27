FROM node:20-alpine

#Create and use new user for security
RUN addgroup nodeapp && adduser -S -G nodeapp nodeapp
USER nodeapp

# Setting working directory
WORKDIR /app

# Copying package.json and package-lock.json
COPY --chown=nodeapp package*.json ./

# Installing dependencies
RUN npm install --production

USER root
# Install FFmpeg. This is needed to convert the video to HLS
RUN apk add --no-cache ffmpeg

# /usr/bin/ffmpeg is the default path for ffmpeg, copy it to /app
RUN cp /usr/bin/ffmpeg /app/ffmpeg && \
    chown nodeapp:nodeapp /app/ffmpeg && \
    chmod +x /app/ffmpeg

    
USER nodeapp

# Copying all the files
COPY --chown=nodeapp . .

# Exposing ports
EXPOSE 8000
EXPOSE 1935

# Running the app
CMD ["npm", "start"]