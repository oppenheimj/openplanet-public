package main

import (
	"fmt"
	"net/http"
	"os"
	"runtime"
	"websockets/server"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
)

var session = server.NewSession()

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// https://github.com/gorilla/websocket/issues/367
		return true
	},
}

func serveWs(writer http.ResponseWriter, request *http.Request) {
	log.Info("New websocket connection")

	conn, err := upgrader.Upgrade(writer, request, nil)
	if err != nil {
		log.Info(err)
		return
	}

	server.NewClient(session, conn)
}

func main() {
	log.Info("Starting websocket server")

	runtime.GOMAXPROCS(32)

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	http.HandleFunc("/", serveWs)
	log.Fatal(
		http.ListenAndServe(
			fmt.Sprintf("websockets:%s", os.Getenv("PORT")),
			nil,
		),
	)
}
