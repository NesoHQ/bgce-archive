package database

type User struct {
	ID          int     `json:"id"`
	FirstName   string  `json:"first_name"`
	LastName    string  `json:"last_name"`
	Email       string  `json:"email"`
	Password    string  `json:"password"`
	IsShopOwner bool  `json:"is_shop_owner"`
}

var users []User

func (u User) Store() User {
	if u.ID != 0 {
		return u
	}

	u.ID = len(users) + 1

	users = append(users, u)
	return u
}

func Find(email, password string) *User {
	for _, u := range users {
		if u.Email == email && u.Password == password {
			return &u
		}
	}

	return nil
}