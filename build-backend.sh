#!/bin/bash -x

# 构建crawlab
image=golang:1.23
hostGO=/data/go
docker run -it --rm \
  -e GOPROXY="https://goproxy.cn,direct" \
  -e GOCACHE=/go/gocache \
  -v ${hostGO}:/go \
  -v ${PWD}:/app \
  -v /root/.ssh:/root/.ssh \
  -v /root/.bash_history:/root/.bash_history \
  -w /app \
  --hostname go \
  --name go \
  --entrypoint bash $image \
  -c '
cd backend;ls;
go mod tidy -v;echo tidy finish;
go build -x -gcflags="all=-N -l" .; echo success;
'

