package cmd

import (
	"fmt"

	"cortex/config"

	"github.com/golang-jwt/jwt"
	"github.com/spf13/cobra"
)

func GenerateJWTCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "gen-jwt",
		Short: "generate a jwt token",
		RunE: func(cmd *cobra.Command, args []string) error {
			conf := config.GetConfig()
			token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
				Id: "1",
			}).SignedString([]byte(conf.JwtSecret))
			if err != nil {
				return err
			}
			fmt.Printf("Generated JWT Token: %q\n", token)
			return nil
		},
	}
}
