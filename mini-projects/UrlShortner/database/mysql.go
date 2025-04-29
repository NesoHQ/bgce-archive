package database

import (
	"UrlShortner/config"
	"fmt"
)

func SaveUrl(shortKey, originalUrl string) error {
	_, err := config.DB.Exec("INSERT INTO urls(short_key, original_url) VALUES(?, ?)", shortKey, originalUrl)
	return err
}

func GetUrl(shortKey string) (string, error) {
	var url string
	err := config.DB.QueryRow("SELECT original_url FROM urls WHERE short_key=?", shortKey).Scan(&url)
	fmt.Println(url + " url from get url func")
	return url, err

}
