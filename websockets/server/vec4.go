package server

import "math"

type vec4 struct {
	x float64
	y float64
	z float64
	w float64
}

func (v *vec4) minus(u vec4) *vec4 {
	return &vec4{v.x - u.x, v.y - u.y, v.z - u.z, v.w - u.w}
}

func computeNormal(v2 []float64, v3 []float64, v1 []float64) []float64 {
	p1 := vec4{v1[0], v1[1], v1[2], v1[3]}
	p2 := vec4{v2[0], v2[1], v2[2], v2[3]}
	p3 := vec4{v3[0], v3[1], v3[2], v3[3]}

	v := p2.minus(p1)
	w := p3.minus(p1)

	x := v.y*w.z - v.z*w.y
	y := v.z*w.x - v.x*w.z
	z := v.x*w.y - v.y*w.x
	s := math.Sqrt(x*x + y*y + z*z)

	return []float64{-x / s, -y / s, -z / s, 0}
}
