package repo  


type Product struct {
	ID 			int     `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImgUrl 		string  `json:"imageUrl"`
}


type ProductRepo interface {
	Create(p Product) (*Product, error)
	Get(productID int) (*Product, error)
	List() ([]*Product, error)
	Delete(productID int) error
	Update(p Product) (*Product, error)
}

type productRepo struct {
	productList []*Product 
}

func NewProductRepo() ProductRepo {
	repo := &productRepo{}

	generateInitialProducts(repo)
	return repo
}

func (r *productRepo) Create(p Product) (*Product, error){
	p.ID = len(r.productList) + 1
	r.productList =  append(r.productList, &p)
	return &p, nil
}

func (r *productRepo) Get(productID int) (*Product, error){
	for _, product := range r.productList{
		if product.ID == productID {
			return product, nil
		}
	}

	return nil, nil
}

func (r *productRepo) List() ([]*Product, error){
	return r.productList, nil

}

func (r *productRepo) Delete(productID int) error{
	var tempList []*Product 
	
	for _, p := range r.productList{
		if p.ID != productID {
			tempList = append(tempList, p) 
		}	
	}

	r.productList = tempList

	return nil

}

func (r *productRepo) Update(product Product) (*Product, error){
	for idx, p := range r.productList{
		if p.ID == product.ID {
			r.productList[idx] = &product
		}	
	}

	return &product, nil
}

func generateInitialProducts(r *productRepo) {
	prd1 := &Product{
		ID: 1,
		Title: "Orange",
		Description: "Orange is red. I love orange.",
		Price: 100,
		ImgUrl: "https://www.dole.com/sites/default/files/media/2025-01/oranges.png",
	}

	prd2 := &Product{
		ID: 2,
		Title: "Apple",
		Description: "Apple is green. I hate apple.",
		Price: 40,
		ImgUrl: "https://www.harrisfarm.com.au/cdn/shop/products/40715-done.jpg",
	}

	prd3 := &Product{
		ID: 3,
		Title: "Banana",
		Description: "Banana is boring. I feel bored eating banana.",
		Price: 5,
		ImgUrl: "https://www.allrecipes.com/thmb/lc7nSL9L5zMHXz9t6PMAVm9biNM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ar-new-banana-adobe-ar-2x1-917fdde58d194b529b41042ebff1c031.jpg",
	}

	prd4 := &Product{
		ID: 4,
		Title: "Angur Fol",
		Description: "Angur Fol Tastes good.",
		Price: 140,
		ImgUrl: "https://cdn.dhakapost.com/media/imgAll/BG/2022January/angur-2-20220215152127.jpg",
	}

	prd5 := &Product{
		ID: 5,
		Title: "Mango",
		Description: "Mango is my favorite. I love it very much.",
		Price: 1000000,
		ImgUrl: "https://www.dole.com/sites/default/files/styles/512w384h-80/public/media/dole-blog-03-maerz-mango-05.jpg?itok=qXHJMEAz-PEthlz_-",
	}

	prd6 := &Product{
		ID: 6,
		Title: "Strawberry",
		Description: "Strawberries are sweet, juicy, and bursting with flavor.",
		Price: 500,
		ImgUrl: "https://snaped.fns.usda.gov/sites/default/files/styles/crop_ratio_7_5/public/seasonal-produce/2018-05/strawberries.jpg.webp?itok=B4LFd4vV",
	}

	r.productList = append(r.productList, prd1)
	r.productList = append(r.productList, prd2)
	r.productList = append(r.productList, prd3)
	r.productList = append(r.productList, prd4)
	r.productList = append(r.productList, prd5)
	r.productList = append(r.productList, prd6)

}