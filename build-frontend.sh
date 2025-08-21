#!/bin/bash -x

#docker build -t pnpm7 -f pnpm7.Dockerfile .
image=pnpm7
docker run -it --rm \
  -v ${PWD}/frontend:/app \
  -v /root/.ssh:/root/.ssh \
  -v /root/.bash_history:/root/.bash_history \
  -w /app \
  --hostname node \
  --name node \
  --entrypoint bash $image \
  -c 'echo "hello 你来啦";
pnpm store path;
pnpm install;
pnpm run build;
'
