package main

import (
	"fmt"
	"log"

	"github.com/nxadm/tail"
)

func main() {

	fmt.Println("starting to tail test.log")
	
	t, err := tail.TailFile("test.log", tail.Config{Follow: true})
	if err != nil {
		log.Fatalf("Failed to tail file: %v", err)
	}
	
	
	fmt.Println(" ---- Reached here!")
	for line := range t.Lines {
		fmt.Println("Reached here 2! ---")
		fmt.Printf("New line found: %s\n", line.Text)
	}

}