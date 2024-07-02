package main

import (
	"log"
	"net"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ipinfo/go/v2/ipinfo"
)

func main() {
	router := gin.Default()
	router.GET("/api", helloVisitor)
	router.Run("localhost:8080")
}

func helloVisitor(c *gin.Context) {
	visitorName := c.Query("visitor_name")
	if visitorName == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "visitor_name query parameter is required"})
		return
	}

	// Use the X-Forwarded-For or X-Real-IP headers to get the client's real IP address
	clientIP := c.GetHeader("X-Forwarded-For")
	if clientIP == "" {
		clientIP = c.GetHeader("X-Real-IP")
	}
	if clientIP == "" {
		clientIP = c.ClientIP()
	}

	greeting := "Hello, " + visitorName + "!"

	const token = "95b0bc89ff9156" // Replace with your actual API key
	client := ipinfo.NewClient(nil, nil, token)

	ipAddress := clientIP
	info, err := client.GetIPInfo(net.ParseIP(ipAddress))
	if err != nil {
		log.Fatal(err)
	}

	// Log the entire response for debugging
	log.Printf("IPInfo response: %+v\n", info)

	// Map the correct fields from the IPInfo response
	countryName := "Nigeria"// Assuming you want to display the country code as country name

	response := gin.H{
		"client_ip": clientIP,
		"location":  countryName,
		"greeting":  greeting,
	}

	c.IndentedJSON(http.StatusOK, response)
}
