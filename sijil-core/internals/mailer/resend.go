package mailer

import (
	"fmt"

	"github.com/resend/resend-go/v3"
)

type Mailer struct {
	client *resend.Client
	fom    string
}

func New(apiKey, fromEmail string) *Mailer {
	if apiKey == "" {
		fmt.Println("⚠️ Resend API key is missing, Email will fail!")
	}

	client := resend.NewClient(apiKey)
	return &Mailer{
		client: client,
		fom:    fromEmail,
	}
}

func (m *Mailer) Send(to, subject, htmlBody string) error {

	emailParams := &resend.SendEmailRequest{
		From:    m.fom,
		To:      []string{to},
		Subject: subject,
		Html:    htmlBody,
	}

	sent, err := m.client.Emails.Send(emailParams)
	if err != nil {
		fmt.Printf("❌ Failed to send email to %s: %v\n", to, err)
		return err
	}

	fmt.Printf("Email sent to %s | ID: %s\n", to, sent.Id)
	return nil
}
