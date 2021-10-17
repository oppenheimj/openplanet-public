package server

import (
	"math"
)

type Chunk struct {
	X float64 `json:"x"`
	Z float64 `json:"z"`

	Ys []float64 `json:"ys"`
}

func (c *Chunk) generate() {
	n := int(math.Floor(DIM / RES))
	c.Ys = make([]float64, (n+1)*(n+1))

	for x := 0; x <= n; x++ {
		for z := 0; z <= n; z++ {
			xPos := c.X + float64(x)*RES
			zPos := c.Z + float64(z)*RES

			i := (n+1)*x + z
			c.Ys[i] = (fbm2D(xPos/16384, zPos/16384, 0.98)+1)/2*1000 - 500
		}
	}
}
