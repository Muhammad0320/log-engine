package hub

import (
	"encoding/json"
	"log-engine/internals/database"

	"github.com/gorilla/websocket"
)

// A wrapper around ws conn
type Client struct {
	conn *websocket.Conn
	send chan []byte 
}

// Hub maintains the set of active clients and broadcast messages

type Hub struct {

	clients map[*Client]bool 
	broadcast chan []byte 
	register chan *Client
	unregister chan *Client
}

func NewHub() *Hub {

	return &Hub{
		clients: make(map[*Client]bool),
		broadcast: make(chan []byte),
		register: make(chan *Client),
		unregister: make(chan *Client),
	}

}

func (h *Hub) Run() {

	for  {

		select {

		case client := <- h.register: 
			h.clients[client] = true
		
		case client := <- h.unregister: 
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <- h.broadcast: 
			for client := range h.clients {
				select {
				case client.send <- message:
					// Message sent successfully
				default: 
					close(client.send)
					delete(h.clients, client)
				}
			}

		}

	}

}

func (h *Hub) BroadCastLog(logEntry database.LogEntry) {

	b, err := json.Marshal(logEntry)
	if err != nil {
		return
	}

	h.broadcast <- b
}