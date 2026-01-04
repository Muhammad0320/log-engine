package server

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strconv"

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
			VariantID int    `json:"variant_id"`
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
		variantID := event.Data.Attributes.VariantID

		// Fetch IDs from Env to be safe against price changes
		// Default to 0 if not set, which won't match
		// TODO: Ensure these are set in your .env file
		// e.g. LEMONSQUEEZY_VARIANT_PRO=12345
		//      LEMONSQUEEZY_VARIANT_BIZ=67890

		// You can also add a fallback to amounts if you want hybrid safety, but ID is better.

		proVariantStr := os.Getenv("LEMONSQUEEZY_VARIANT_PRO")
		bizVariantStr := os.Getenv("LEMONSQUEEZY_VARIANT_BIZ")

		// If env vars are set, use them.
		// Note: This logic assumes the variants are integers.
		// In a real scenario, you'd parse them.
		// For now, let's keep it simple:

		// We just cast the incoming variantID to string for comparison or parse the env var.

		if proVariantStr != "" && isVariantMatch(variantID, proVariantStr) {
			planID = 2
		} else if bizVariantStr != "" && isVariantMatch(variantID, bizVariantStr) {
			planID = 3
		}

		// Fallback to amount if ENV is missing (Legacy support)
		if planID == 0 {
			amount := event.Data.Attributes.Total
			if amount >= 1900 && amount <= 2100 {
				planID = 2
			} else if amount >= 9900 {
				planID = 3
			}
		}

		if planID > 1 {
			err := s.identityRepo.UpdateUserPlan(c.Request.Context(), event.Meta.CustomData.UserID, planID)
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

func isVariantMatch(id int, envVal string) bool {
	return strconv.Itoa(id) == envVal
}
