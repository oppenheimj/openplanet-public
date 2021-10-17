package server

import (
	"encoding/json"
	"math"
	"sync"

	log "github.com/sirupsen/logrus"
)

type Session struct {
	terrain *Terrain
	cm      *coordMap
}

func NewSession() *Session {
	log.Info("Creating new session")

	session := Session{}

	session.terrain = &Terrain{}
	session.terrain.Init()

	session.cm = NewCoordMap(session.terrain)

	return &session
}

func (session *Session) UpdatePlayer(player *Player, message []byte) {
	oldPosition := player.Position
	_ = json.Unmarshal(message, player)
	newPosition := player.Position

	go session.cm.updatePlayer(player)

	oldCoord := xzToCoord(oldPosition[0], oldPosition[2])
	newCoord := xzToCoord(newPosition[0], newPosition[2])

	if oldCoord != newCoord || len(player.chunksSet) == 0 {
		if len(player.chunksSet) > 0 {
			player.coord = newCoord
			log.Info("Player ", player.Id, " moved from ", oldCoord, " to ", newCoord)

			// shift player in coordMap
			session.cm.deletePlayer(player, oldCoord)
			session.cm.addPlayer(player)

			oldRenderCoords := session.terrain.computeCoordsAround(oldPosition[0], oldPosition[2], N_RENDER)
			newRenderCoords := session.terrain.computeCoordsAround(newPosition[0], newPosition[2], N_RENDER)

			diffedCoordsOld := diffCoords(oldRenderCoords, newRenderCoords)
			diffedCoordsNew := diffCoords(newRenderCoords, oldRenderCoords)

			// load new players
			go session.cm.loadPlayers(player, diffedCoordsNew)

			// despawn old players
			go session.cm.broadcastDisconnect(player, diffedCoordsOld, true)
		}

		// send new chunks to player
		newLoadCoords := session.terrain.computeCoordsAround(newPosition[0], newPosition[2], N_LOAD)
		go session.computeNewChunksToSend(player, newLoadCoords)
	}
}

func (session *Session) DeletePlayer(player *Player) {
	log.Info("Disconnecting player with id", player.Id)

	session.cm.deletePlayer(player, player.coord)

	coords := session.terrain.computeCoordsAround(player.Position[0], player.Position[2], N_RENDER)
	go session.cm.broadcastDisconnect(player, coords, false)
}

func (session *Session) sendChunk(player *Player, coord string, wg *sync.WaitGroup) {
	chunk := session.terrain.GenerateChunkAt(coord)

	player.client.send <- TerrainMessage{
		MessageType: "TERRAIN",
		Data:        *chunk,
	}

	wg.Done()
}

func (session *Session) computeNewChunksToSend(player *Player, coords []string) {
	wg := sync.WaitGroup{}

	for _, coord := range coords {
		if _, ok := player.chunksSet[coord]; !ok {
			player.chunksSet[coord] = struct{}{}

			// log.Info("Player missing chunk at", coord)

			wg.Add(1)
			go session.sendChunk(player, coord, &wg)
		}
	}

	wg.Wait()
}

func xzToCoord(x float64, z float64) string {
	playerChunkX := DIM * int(math.Floor(x/float64(DIM)))
	playerChunkZ := DIM * int(math.Floor(z/float64(DIM)))

	return coords2Key(playerChunkX, playerChunkZ)
}
