package repo

type User struct {
	ID          int     `json:"id"`
	FirstName   string  `json:"first_name"`
	LastName    string  `json:"last_name"`
	Email       string  `json:"email"`
	Password    string  `json:"password"`
	IsShopOwner bool  `json:"is_shop_owner"`
}

type UserRepo interface {
	Create(user User) (*User, error)
	Find(email, pass string) (*User, error)
	// Get(userID int) (*User, error)
	// List() ([]*User, error)
	// Delete(userID int) error
	// Update(user User) (*User, error)
}

type userRepo struct {
	users []User	
}

func NewUserRepo() UserRepo {
	return &userRepo{}
}

func (r userRepo) Create(user User) (*User, error) {
	if user.ID != 0 {
		return &user, nil
	}

	user.ID = len(r.users) + 1

	r.users = append(r.users, user)
	return &user, nil
}

func (r *userRepo) Find(email, pass string) (*User, error) {
	for _, u := range r.users {
		if u.Email == email && u.Password == pass {
			return &u, nil
		}
	}

	return nil, nil
}