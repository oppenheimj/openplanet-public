package server

import (
	"time"

	uuid "github.com/satori/go.uuid"
)

type Ufo struct {
	Id       uuid.UUID  `json:"id"`
	Position [3]float64 `json:"position"`
	Right    [3]float64 `json:"right"`
	Up       [3]float64 `json:"up"`
	Forward  [3]float64 `json:"forward"`
	JoinedAt time.Time  `json:"joinedAt"`
}

func newUfo(id uuid.UUID) *Ufo {
	u := &Ufo{
		Id:       id,
		Position: [3]float64{1, 50, 10},
		Right:    [3]float64{0, 0, -1},
		Up:       [3]float64{0, 1, 0},
		Forward:  [3]float64{-1, 0, 0},
		JoinedAt: time.Now(),
	}

	return u
}

func (ufo *Ufo) updatePosition() {

}
