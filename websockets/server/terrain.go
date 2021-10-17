package server

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"sync"
)

const (
	DIM      = 400
	RES      = 2.0
	N_RENDER = 2
	N_LOAD   = 3
)

type Terrain struct {
	Coord2Chunk     map[string]*Chunk
	Coord2ChunkLock *sync.Mutex
}

func (t *Terrain) Init() {
	t.Coord2Chunk = make(map[string]*Chunk)
	t.Coord2ChunkLock = &sync.Mutex{}
}

func (t *Terrain) GenerateChunkAt(key string) *Chunk {
	x, z := key2Coords(key)

	t.Coord2ChunkLock.Lock()

	if _, ok := t.Coord2Chunk[coords2Key(x, z)]; !ok {
		t.Coord2ChunkLock.Unlock()
		// log.Info("Terrain generating chunk at (", x, ", ", z, ")")

		chunk := Chunk{X: float64(x), Z: float64(z)}
		chunk.generate()

		t.Coord2ChunkLock.Lock()
		t.Coord2Chunk[coords2Key(x, z)] = &chunk
		t.Coord2ChunkLock.Unlock()
	} else {
		t.Coord2ChunkLock.Unlock()
		// log.Info("Terrain using cached chunk at (", x, ", ", z, ")")
	}

	// TODO: Make this not horrible

	t.Coord2ChunkLock.Lock()
	toReturn := t.Coord2Chunk[coords2Key(x, z)]
	t.Coord2ChunkLock.Unlock()

	return toReturn
}

func (t *Terrain) computeCoordsAround(x float64, z float64, n int) []string {
	var coords []string

	playerChunkX := DIM * int(math.Floor(x/float64(DIM)))
	playerChunkZ := DIM * int(math.Floor(z/float64(DIM)))

	for x := playerChunkX - n*DIM; x <= playerChunkX+n*DIM; x += DIM {
		for z := playerChunkZ - n*DIM; z <= playerChunkZ+n*DIM; z += DIM {
			coords = append(coords, coords2Key(x, z))
		}
	}

	return coords
}

func coords2Key(x int, z int) string {
	return fmt.Sprintf("%d,%d", x, z)
}

func key2Coords(key string) (int, int) {
	keySplit := strings.Split(key, ",")
	var coords = []int{}

	for _, d := range keySplit {
		dInt, err := strconv.Atoi(d)

		if err != nil {
			panic(err)
		}

		coords = append(coords, dInt)
	}

	return coords[0], coords[1]
}

func diffCoords(oldCoords []string, newCoords []string) []string {
	var diff []string

	for _, oldCoord := range oldCoords {
		inNew := false

		for _, newCoord := range newCoords {
			if oldCoord == newCoord {
				inNew = true
				break
			}
		}

		if !inNew {
			diff = append(diff, oldCoord)
		}
	}

	return diff
}
