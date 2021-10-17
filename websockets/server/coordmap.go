package server

import (
	"sync"

	log "github.com/sirupsen/logrus"
)

type coordMap struct {
	cMap *sync.Map
	t    *Terrain
}

func NewCoordMap(terrain *Terrain) *coordMap {
	cm := coordMap{t: terrain}
	cm.cMap = &sync.Map{}

	return &cm
}

func (cm *coordMap) addPlayer(p *Player) {
	var ps *playerSet

	if value, ok := cm.cMap.Load(p.coord); ok {
		ps = value.(*playerSet)
	} else {
		ps = NewPlayerSet()
		cm.cMap.Store(p.coord, ps)
	}

	ps.mutex.Lock()
	ps.set[p] = struct{}{}
	ps.mutex.Unlock()
}

func (cm *coordMap) deletePlayer(p *Player, oldCoord string) {
	if value, ok := cm.cMap.Load(oldCoord); ok {
		ps := value.(*playerSet)

		ps.mutex.Lock()
		delete(ps.set, p)
		ps.mutex.Unlock()
	}
}

func (cm *coordMap) updatePlayer(p *Player) {
	coords := cm.t.computeCoordsAround(p.Position[0], p.Position[2], N_RENDER)

	for _, coord := range coords {
		if value, ok := cm.cMap.Load(coord); ok {
			ps := value.(*playerSet)

			ps.notifyUpdate(p)
		}
	}
}

func (cm *coordMap) loadPlayers(p *Player, coords []string) {
	log.Info("Loading players in coords", coords)

	for _, coord := range coords {
		if value, ok := cm.cMap.Load(coord); ok {
			ps := value.(*playerSet)

			ps.loadPlayers(p)
		}
	}
}

func (cm *coordMap) broadcastDisconnect(player *Player, coords []string, wsOpen bool) {
	// log.Info("Broadcasting disconnect of player ", player.Id)

	for _, coord := range coords {
		if value, ok := cm.cMap.Load(coord); ok {
			ps := value.(*playerSet)

			// tell players in playerSet to despawn player
			ps.notifyDisconnect(player)

			if wsOpen {
				// tell player to despawn players in playerSet
				ps.disconnectPlayers(player)
			}
		}
	}
}
