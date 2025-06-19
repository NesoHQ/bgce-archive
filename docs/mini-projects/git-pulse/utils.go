package main 

func Capitalize(s string) string {
	if len(s) == 0 {
		return s
	}
	return string(s[0] - 32) + s[1:]
}