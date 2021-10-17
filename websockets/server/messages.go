package server

type InitMessage struct {
	MessageType string      `json:"messageType"`
	Data        InitPayload `json:"data"`
}

type InitPayload struct {
	Player       Player   `json:"player"`
	OtherPlayers []Player `json:"otherPlayers"`
}

type UpdateMessage struct {
	MessageType string `json:"messageType"`
	Data        Player `json:"data"`
}

type TerrainMessage struct {
	MessageType string `json:"messageType"`
	Data        Chunk  `json:"data"`
}
