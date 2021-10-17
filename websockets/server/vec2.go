package server

import "math"

type vec2 struct {
	x float64
	z float64
}

func (v *vec2) minus(u vec2) *vec2 {
	return &vec2{v.x - u.x, v.z - u.z}
}

func (v *vec2) pow(s float64) *vec2 {
	return &vec2{math.Pow(v.x, s), math.Pow(v.z, s)}
}

func (v *vec2) plusVec2(u vec2) *vec2 {
	return &vec2{v.x + u.x, v.z + u.z}
}

func (v *vec2) plusScalar(s float64) *vec2 {
	return &vec2{v.x + s, v.z + s}
}

func (v *vec2) div(s float64) *vec2 {
	return &vec2{v.x / s, v.z / s}
}

func (v *vec2) dot(u vec2) float64 {
	return v.x*u.x + v.z*u.z
}

func (v *vec2) floor() *vec2 {
	return &vec2{math.Floor(v.x), math.Floor(v.z)}
}

func (v *vec2) abs() *vec2 {
	return &vec2{math.Abs(v.x), math.Abs(v.z)}
}

func (v *vec2) mult(s float64) *vec2 {
	return &vec2{v.x * s, v.z * s}
}

func (v *vec2) norm() *vec2 {
	return v.div(v.x + v.z)
}
