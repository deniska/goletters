package main

import (
	"flag"
	"log"
	"net/http"
	"text/template"
)

var addr = flag.String("addr", ":8080", "http server address")
var rootTempl = template.Must(template.ParseFiles("game.html"))

func serveRoot(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Error(w, "Not found", 404)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method nod allowed", 405)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	rootTempl.Execute(w, r.Host)
}

func main() {
	log.Println("Started")
	go h.run()
	flag.Parse()
	http.HandleFunc("/", serveRoot)
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static/"))))
	http.HandleFunc("/ws", serveWs)
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("Listen and serve: ", err)
	}
}
