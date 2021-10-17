package server

import "math"

func fbm2D(x float64, z float64, p float64) float64 {
	total := 0.0
	octaves := 8

	for i := 0; i < octaves; i++ {
		freq := math.Pow(2, float64(i))
		amp := math.Pow(p, float64(i))

		total += (perlinNoise2D(vec2{x * freq, z * freq}) * amp)
	}

	return total
}

func perlinNoise2D(v vec2) float64 {
	surfletSum := 0.0

	for dx := 0; dx <= 1; dx++ {
		for dy := 0; dy <= 1; dy++ {
			surfletSum += surflet(v, *v.floor().plusVec2(vec2{float64(dx), float64(dy)}))
		}
	}

	return surfletSum
}

func surflet(p vec2, gridPoint vec2) float64 {
	t2 := p.minus(gridPoint).abs()
	t := vec2{1, 1}

	t = *t.minus(
		*t2.pow(5).mult(6)).plusVec2(
		*t2.pow(4).mult(15)).minus(
		*t2.pow(3).mult(10))

	gradient := noise2DNormalVector(gridPoint).mult(2).minus(vec2{1, 1})
	diff := p.minus(gridPoint)

	height := diff.dot(*gradient)

	return height * t.x * t.z
}

func noise2DNormalVector(v vec2) *vec2 {
	v = *v.plusScalar(0.001)

	randsA := vec2{126.1, 311.7}
	randsB := vec2{420.2, 1337.1}

	noise := vec2{
		math.Abs(math.Mod(math.Sin(randsA.dot(v)), 1)),
		math.Abs(math.Mod(math.Cos(randsB.dot(v)), 1)),
	}

	return noise.norm()
}
