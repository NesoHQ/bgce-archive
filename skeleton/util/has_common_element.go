package util

func HasCommonElement(slice1, slice2 []string) bool {
	for _, item1 := range slice1 {
		for _, item2 := range slice2 {
			if item1 == item2 {
				return true
			}
		}
	}
	return false
}
