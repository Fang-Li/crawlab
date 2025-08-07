FROM golang:1.23 AS build

WORKDIR /go/src/app
COPY . .

ENV GO111MODULE on
ENV GOPROXY https://goproxy.io

RUN cd /go/src/app/backend && go mod tidy \
  && go install -v ./...

FROM alpine:3.14

# copy files
COPY --from=build /go/bin/crawlab /go/bin/crawlab
