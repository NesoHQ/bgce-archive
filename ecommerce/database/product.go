package database

type Product struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImgURL      string  `json:"imageUrl"`
}

var ProductList []Product

func init() {
	prd1 := Product{
		ID:          1,
		Title:       "Orange",
		Description: "Juicy, vitamin-rich oranges grown in Bangladesh.",
		Price:       120,
		ImgURL:      "https://www.dole.com/sites/default/files/media/2025-01/oranges.png",
	}
	prd2 := Product{
		ID:          2,
		Title:       "Apple",
		Description: "Crisp, sweet apples fresh from the orchard.",
		Price:       150,
		ImgURL:      "https://5.imimg.com/data5/AK/RA/MY-68428614/apple.jpg",
	}
	prd3 := Product{
		ID:          3,
		Title:       "Banana",
		Description: "Fresh, ripe bananas — perfect for a healthy snack.",
		Price:       60,
		ImgURL:      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
	}
	prd4 := Product{
		ID:          4,
		Title:       "Watermelon",
		Description: "Sweet and refreshing watermelon, perfect for summer.",
		Price:       300,
		ImgURL:      "https://weresmartworld.com/sites/default/files/styles/full_screen/public/2021-04/watermeloen_2.jpg?itok=CCYHLr5M",
	}
	prd5 := Product{
		ID:          5,
		Title:       "Papaya",
		Description: "Delicious papaya rich in vitamins and antioxidants.",
		Price:       200,
		ImgURL:      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaAXtZXW0NwXfeThZW9BbWaT36At6cOjfv4Q&s",
	}
	prd6 := Product{
		ID:          6,
		Title:       "Mango",
		Description: "Sweet, golden mangoes — the pride of Bangladesh.",
		Price:       250,
		ImgURL:      "https://img.freepik.com/free-photo/mango-still-life_23-2151542114.jpg?w=360",
	}
	ProductList = append(ProductList, prd1, prd2, prd3, prd4, prd5, prd6)
}
