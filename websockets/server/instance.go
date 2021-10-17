package server

import (
	uuid "github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"
)

type instance struct {
	Id       uuid.UUID `json:"id"`
	
}

func NewInstance() {
	log.Info("Creating new instance")
}