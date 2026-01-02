package server

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"sijil-core/internals/database"

	"github.com/gin-gonic/gin"
)

type LemonEvent struct {
	Meta struct {
		EventName  string `json:"event_name"`
		CustomData struct {
			UserID int `json:"user_id,string"`
		} `json:"custom_data"`
	} `json:"meta"`

	Data struct {
		Attributes struct {
			Status    string `json:"status"`
			Total     int    `json:"total"`
			UserEmail string `json:"user_email"`
		} `json:"attributes"`
	} `json:"data"`
}

func (s *Server) handleLemonWebhook(c *gin.Context) {

	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	secret := os.Getenv("LEMONSQUEEZY_WEBHOOK_SECRET")
	signature := c.GetHeader("X-Signature")

	if !checkLemonSignature(payload, secret, signature) {
		c.Status(http.StatusUnauthorized)
		return
	}

	// Parse event
	var event LemonEvent
	if err = json.Unmarshal(payload, &event); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	if event.Meta.EventName == "subscription_created" || event.Meta.EventName == "order_created" {

		var planID int
		amount := event.Data.Attributes.Total

		if amount >= 1900 && amount <= 2100 {
			planID = 2
		} else if amount >= 9900 {
			planID = 3
		}

		if planID > 0 {
			err := database.UpgradeUserPlan(c.Request.Context(), s.db, event.Meta.CustomData.UserID, planID)
			if err != nil {
				c.Status(500)
				return
			}
		}

	}
	c.Status(200)

}

func checkLemonSignature(payload []byte, secret string, signature string) bool {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write(payload)
	expectedSignature := hex.EncodeToString(h.Sum(nil))
	return hmac.Equal([]byte(expectedSignature), []byte(signature))
}
