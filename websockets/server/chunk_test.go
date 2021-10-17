package server

import (
	"testing"
)

func TestGenerate(t *testing.T) {
	tests := [...]struct {
		x   float64
		z   float64
		dim float64
		res float64
	}{
		{x: 0, z: 0, dim: 10, res: 1},
	}

	for _, test := range tests {
		c := Chunk{X: test.x, Z: test.z}
		c.generate()
		// if err != nil {
		// 	t.Fatalf("%s: %v\n", test, err)
		// }
	}
}
