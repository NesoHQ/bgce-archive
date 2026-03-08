package cmd

import (
	"github.com/spf13/cobra"
)

var genJWTCmd = &cobra.Command{
	Use:   "gen-jwt",
	Short: "generate a jwt token",
	RunE:  genJWT,
}

func genJWT(cmd *cobra.Command, args []string) error {
	// conf := config.GetConfig()

	// token, err := jwt.NewWithClaims(
	// 	jwt.SigningMethodHS256,
	// 	jwt.MapClaims{
	// 		"Id": 1,
	// 	},
	// ).SignedString([]byte(conf.JwtSecret))
	// if err != nil {
	// 	return err
	// }

	// slog.Info("Generated JWT Token", "JWT_TOKEN", token)

	return nil
}
