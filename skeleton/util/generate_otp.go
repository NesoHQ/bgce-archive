package util

import (
	"crypto/rand"
	"fmt"
	"math/big"
)

func GenerateOtp() (string, error) {
	otp, err := rand.Int(rand.Reader, big.NewInt(900000))
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%06d", otp.Int64()+100000), nil
}
