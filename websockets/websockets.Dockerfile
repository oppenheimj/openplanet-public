FROM golang:1.16

WORKDIR /go/src/websockets
COPY ./websockets .

RUN GO111MODULE=off
RUN go mod init
RUN go get ./...
RUN go build main.go

CMD ["./main"]
