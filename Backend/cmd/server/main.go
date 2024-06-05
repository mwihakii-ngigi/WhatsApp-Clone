package main

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type Message struct {
	Username string `json:"username"`
	Text     string `json:"text"`
	File     string `json:"file"`
}

var messages []Message

func main() {
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./frontend/build", true)))

	router.GET("/api/messages", getMessages)
	router.POST("/api/messages", postMessage)
	router.POST("/api/upload", uploadFile)

	router.Run(":8080")
}

func getMessages(c *gin.Context) {
	c.JSON(http.StatusOK, messages)
}

func postMessage(c *gin.Context) {
	var message Message
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	messages = append(messages, message)
	c.JSON(http.StatusCreated, message)
}

func uploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	filename := filepath.Base(file.Filename)
	if err := c.SaveUploadedFile(file, filepath.Join("./uploads", filename)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"filename": filename})
}
