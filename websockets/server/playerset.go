package server

import (
	"sync"

	log "github.com/sirupsen/logrus"
)

type playerSet struct {
	set   map[*Player]struct{}
	mutex *sync.Mutex
}

func NewPlayerSet() *playerSet {
	pm := playerSet{}
	pm.set = make(map[*Player]struct{})
	pm.mutex = &sync.Mutex{}

	return &pm
}

func (ps *playerSet) addPlayer(p *Player) {
	ps.mutex.Lock()
	ps.set[p] = struct{}{}
	ps.mutex.Unlock()
}

func (ps *playerSet) deletePlayer(p *Player) {
	ps.mutex.Lock()
	delete(ps.set, p)
	ps.mutex.Unlock()
}

func (ps *playerSet) loadPlayers(p *Player) {
	ps.mutex.Lock()

	for otherPlayer := range ps.set {
		if otherPlayer != p {
			log.Info("Loading player ", otherPlayer.Id, " for player ", p.Id)

			p.client.send <- UpdateMessage{
				MessageType: "UPDATE",
				Data:        *otherPlayer,
			}
		}
	}

	ps.mutex.Unlock()
}

func (ps *playerSet) notifyDisconnect(player *Player) {
	ps.mutex.Lock()

	for otherPlayer := range ps.set {
		log.Info("Notifying player ", otherPlayer.Id, " of disconnecting player ", player.Id)

		otherPlayer.client.send <- UpdateMessage{
			MessageType: "DISCONNECT",
			Data:        *player,
		}
	}

	ps.mutex.Unlock()
}

func (ps *playerSet) disconnectPlayers(player *Player) {
	ps.mutex.Lock()

	for otherPlayer := range ps.set {
		log.Info("Disconnecting player ", otherPlayer.Id, " of from player ", player.Id)

		player.client.send <- UpdateMessage{
			MessageType: "DISCONNECT",
			Data:        *otherPlayer,
		}
	}

	ps.mutex.Unlock()
}

func (ps *playerSet) notifyUpdate(player *Player) {
	ps.mutex.Lock()

	for otherPlayer := range ps.set {
		if player != otherPlayer {
			otherPlayer.client.send <- UpdateMessage{
				MessageType: "UPDATE",
				Data:        *player,
			}
		}
	}

	ps.mutex.Unlock()
}
