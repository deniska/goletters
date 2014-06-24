package main

// hub maintains the set of active connections and broadcasts messages to the
// connections.

import (
	"encoding/json"
	"log"
	"math/rand"
)

type letter struct {
	Id int
	X  int
	Y  int
}

type msg struct {
	Id int
	X  float32
	Y  float32
}

type hub struct {
	letters []letter
	// Registered connections.
	connections map[*connection]bool

	// Inbound messages from the connections.
	broadcast chan []byte

	// Register requests from the connections.
	register chan *connection

	// Unregister requests from connections.
	unregister chan *connection
}

var h = hub{
	broadcast:   make(chan []byte),
	register:    make(chan *connection),
	unregister:  make(chan *connection),
	connections: make(map[*connection]bool),
}

const alphabet_length = 26
const lettersCount = alphabet_length * 7

func (h *hub) run() {
	log.Println("Hub started")
	h.letters = make([]letter, lettersCount)
	for i := 0; i < lettersCount; i++ {
		h.letters[i] = letter{i, rand.Intn(750), rand.Intn(450)}
	}
	for {
		select {
		case c := <-h.register:
			h.connections[c] = true
			for _, l := range h.letters {
				b, _ := json.Marshal(l)
				c.send <- b
			}
			log.Printf("Connected\n")
		case c := <-h.unregister:
			log.Printf("Disconnected\n")
			delete(h.connections, c)
			close(c.send)
		case m := <-h.broadcast:
			var l msg
			err := json.Unmarshal(m, &l)
			log.Printf("%s recieved\n", m)
			if err == nil && l.Id >= 0 && l.Id < lettersCount {
				log.Printf("Letter %v moved\n", l)
				h.letters[l.Id].X = int(l.X)
				h.letters[l.Id].Y = int(l.Y)
				for c := range h.connections {
					select {
					case c.send <- m:
					default:
						close(c.send)
						delete(h.connections, c)
					}
				}
			} else {
				if err != nil {
					log.Printf(err.Error())
				} else {
					log.Printf("Out of bounds")
				}
			}
		}
	}
}
