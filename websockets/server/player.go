package server

import (
	uuid "github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"
)

type Player struct {
	Id        uuid.UUID  `json:"id"`
	Position  [3]float64 `json:"position"`
	Right     [3]float64 `json:"right"`
	Up        [3]float64 `json:"up"`
	Forward   [3]float64 `json:"forward"`
	chunksSet map[string]struct{}
	coord     string
	client    *Client
	
}

func newPlayer(id uuid.UUID, client *Client) *Player {
	log.Info("Creating new player with id", id)

	p := &Player{
		Id:       id,
		Position: [3]float64{1, 20, 10},
		Right:    [3]float64{0, 0, -1},
		Up:       [3]float64{0, 1, 0},
		Forward:  [3]float64{-1, 0, 0},
		client:   client,
	}

	p.chunksSet = make(map[string]struct{})
	p.coord = xzToCoord(p.Position[0], p.Position[2])

	return p
}
