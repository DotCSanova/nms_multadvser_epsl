const NodeMediaServer = require("node-media-server");

const httpConfig = {
  port: 8000,
  allow_origin: "*",
  mediaroot: "./media",
};

const rtmpConfig = {
  port: 1935,
  chunk_size: 60000,
  gop_cache: true,
  ping: 10,
  ping_timeout: 60,
};

const transformationConfig = {
  ffmpeg: "./ffmpeg",
  tasks: [
    {
      app: "live",
      hls: true,
      hlsFlags: "[hls_time=1:hls_list_size=2:hls_flags=delete_segments+append_list]",
      hlsKeep: false,
      ac: "aac",
      audioProfile: "aac_low", // Perfil de audio AAC
      audioBitrate: 128, 
    },
  ],
  MediaRoot: "./media",
};

const config = {
  http: httpConfig,
  rtmp: rtmpConfig,
  trans: transformationConfig,
};

const nms = new NodeMediaServer(config);

nms.run();