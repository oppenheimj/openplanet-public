package server

import (
	"time"

	"github.com/gorilla/websocket"
	uuid "github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 20 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 30 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = pongWait * 9 / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Client is a middleman between the websocket connection and the session.
type Client struct {
	Id       uuid.UUID `json:"id"`
	session  *Session
	player   *Player
	joinedAt time.Time `json:"joinedAt"`

	conn *websocket.Conn
	send chan interface{}
}

func NewClient(session *Session, conn *websocket.Conn) {
	id := uuid.NewV4()

	log.Info("Creating new client with id", id)

	c := &Client{
		Id:       id,
		session:  session,
		joinedAt: time.Now(),
		conn:     conn,
		send:     make(chan interface{}, 128),
	}

	go c.writePump()
	go c.readPump()

	newPlayer := newPlayer(id, c)
	c.player = newPlayer

	session.cm.addPlayer(newPlayer)

	coords := session.terrain.computeCoordsAround(newPlayer.Position[0], newPlayer.Position[2], N_RENDER)
	session.cm.loadPlayers(newPlayer, coords)

	c.send <- InitMessage{
		MessageType: "INIT",
		Data: InitPayload{
			Player: *newPlayer,
		},
	}
}

func (c *Client) readPump() {
	defer func() {
		log.Info("Closing readPump for client ", c.Id)
		c.conn.Close()
	}()

	// c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(
		func(string) error {
			c.conn.SetReadDeadline(time.Now().Add(pongWait))
			return nil
		},
	)

	for {
		_, message, err := c.conn.ReadMessage()

		if err != nil {
			log.Info("ReadPump err ", err)
			c.session.DeletePlayer(c.player)
			return
		}

		c.session.UpdatePlayer(c.player, message)
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)

	defer func() {
		log.Info("Closing writePump for client ", c.Id)
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))

			if !ok {
				// The session closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			c.conn.WriteJSON(message)

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Info("Ticker err ", err)
				return
			}
		}
	}
}
