package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func FetchAndPrintActivity(username string) error {
	url := fmt.Sprintf("https://api.github.com/users/%s/events", username)
	resp, err := http.Get(url)

	if err != nil {
		return fmt.Errorf("failed to fetch data: %v", err)
	}
	defer resp.Body.Close()


	if resp.StatusCode != 200 {
		if resp.StatusCode == http.StatusNotFound {
			return fmt.Errorf("user not found or has no recent public activity")
		}
		return fmt.Errorf("GitHub API returned status code: %d", resp.StatusCode)
	}

	var events []map[string]any
	err = json.NewDecoder(resp.Body).Decode(&events)
	if err != nil {
		return fmt.Errorf("failed to decode response: %v", err)
	}

	printEvents(events)
	return nil
}

func printEvents(events []map[string]any) {
	for _, event := range events {
		eventType := event["type"].(string)
		repo := event["repo"].(map[string]any)["name"].(string)

		switch eventType{
		case "PushEvent":
			payload := event["payload"].(map[string]any)
			commits := payload["commits"].([]any)
			fmt.Printf("- Pushed %d commits to %s\n", len(commits), repo)

		case "IssuesEvent":
			payload := event["payload"].(map[string]any)
			action := payload["action"].(string)
			fmt.Printf("- %s an issue in %s\n", Capitalize(action), repo)
			
		case "WatchEvent":
			fmt.Printf("- Starred %s\n", repo)

		case "ForkEvent":
			fmt.Printf("- Forked %s\n", repo)
		}
	}
}