## Database Tables
### users
|id| first_name | last_name |UNIQUE(user_name)|password_digest|
|--|--|--|--|--|
|serial primary key| string| string| string| string|
### products
|id| name | url| description| price|
|--|--|--|
|serial primary key| string| string| string| number|
### orders
|id| status | user_id|
|--|--|--|
|serial primary key| string| foreign key references(users)|
### order_items
|id| quantity | order_id | product_id | constraints|
|--|--|--|--|--|
|serial primary key| string| foreign key references(orders) | foreign key references(products)| UNIQUE(order_id, product_id)|

## Data Shapes
#### Product
- id: string
- name: string
- url: string
- description: string
- price: number

#### User
- id: string
- first_name: string
- last_name: string
- user_name: string
- password: string

#### Order
- id: string
- status of order (active or complete): string
- user_id: string

#### Order_item
- id: string
- quantity: number
- order_id: string
- product_id: string

#### CartItem (join operation)
- item_id: string
- product_id: string
- name: string
- url: string
- description: string
- price: number
- quantity: number

## Application URL
`http://localhost:5000`
## API Endpoints
### Products
* **URLs**<br />
    `/api/products/<product_id>`<br />
    `/api/dashboard/most_expensive`<br />
    `/api/dashboard/most_popular`<br />
* **Methods:**<br />
    `GET`|`POST`|`PUT`|`DELETE`<br />
* **URL Params**<br />
    * **Optional:**<br />
    `product_id:[string]`
* **Request body**<br />
    * **Create:**<br />
    `name:[string]`<br />
    `price:[number]`<br />
    * **Update:**<br />
    `id:[string]`<br />
    `name:[string]`<br />
    `price:[number]`<br />
* **Success Response:**<br />
    * **Code:** 200 <br />
        **Content:** `Product or Array<Product>`<br />
* **Error Response:**<br />
    * **Code:** 404 <br />
        **Content:** `{ error : "No results found" }`<br />
    * **Code:** 401 <br />
        **Content:** `{ error : "Not authorized (no token was sent or invalid token)" }`<br />  
    * **Code:** 400 <br />
        **Content:** `{ error : "Invalid Data" }` <br /> 
    * **Code:** 500 <br />
        **Content:** `{ error : "Internal server error" }` <br />
* **Satisfied requirements:**<br />
    * **Products:**<br />
        * Index: GET `/api/products/`
        * Show: GET `/api/products/<product_id>`
        * Create [token required]: POST `/api/products/`
        * Update [token required]: PUT `/api/products/<product_id>`
        * Delete [token required]: DELETE `/api/products/<product_id>`
        * Get a list of 5 most expensive products: GET `/api/dashboard/most_expensive`
        * Get a list of 5 most popular products: GET `/api/dashboard/most_popular`

### Users
* **URLs**<br />
    `/api/users/<user_id>`<br />
    `/api/users/sign_up`<br />
    `/api/users/sign_in`<br />
    `/api/users/<user_id>/orders/active`<br />
    `/api/users/<user_id>/orders/completed`<br />
* **Methods:**<br />
    `GET`|`POST`|`PUT`|`DELETE`<br />
* **URL Params**<br />
    * **Optional:**<br />
    `user_id:[string]`<br />
* **Request body**<br />
    * **Sign up:**<br />
    `first_name:[string]`<br />
    `last_name:[string]`<br />
    `user_name:[string]`<br />
    `password:[string]`<br />
    * **Sign up:**<br />
    `user_name:[string]`<br />
    `password:[string]`<br />
    * **Update:**<br />
    `id:[string]`<br />
    `first_name:[string]`<br />
    `last_name:[string]`<br />
    `user_name:[string]`<br />
* **Success Response:**<br />
    * **Code:** 200 <br />
        **Content:** `User or Array<User> (Index, show, update, delete)`<br />
    * **Code:** 200 <br />
        **Content:** `Authorization Token along with a user ID (sign up, sign in)`<br />
    * **Code:** 200 <br />
        **Content:** `List of active or completed orders in the form Array<{order_id: string, order_status: string, order_details: Array<CartItems>}>`<br />
* **Error Response:**<br />
    * **Code:** 404 <br />
        **Content:** `{ error : "No results found" }`<br />
    * **Code:** 401 <br />
        **Content:** `{ error : "Not authorized (no token was sent or invalid token)" }`  <br />
    * **Code:** 400 <br />
        **Content:** `{ error : "Invalid Data" }`  <br />
    * **Code:** 500 <br />
        **Content:** `{ error : "Internal server error" }` <br />
* **Satisfied requirements:**<br />
    * **Users:**<br />
        * Index [token required]: GET `/api/users`
        * Show  [token and correct id required]: GET `/api/users/<user_id>`
        * Sign up: POST `/api/users/sign_up`
        * Sign in: POST `/api/users/sign_in`
        * Update [token and correct id required]: PUT `/api/users/<user_id>`
        * Delete [token and correct id required]: DELETE `/api/users/<user_id>`
    * **Orders:**<br />
        * Detailed Current Active Orders by user [token and correct id required]: GET `/api/users/<user_id>/orders/active`
        * Detailed List of Completed Orders by user [token and correct id required]: GET `/api/users/<user_id>/orders/completed`


### Orders<br />
* **URLs**<br />
    `/api/orders/<order_id>`<br />
    `/api/orders/<order_id>/items/<item_id>`<br />
    `/api/dashboard/most_recent`<br />
* **Methods:**<br />
    `GET`|`POST`|`PUT`|`DELETE`<br />
* **URL Params**<br />
    * **Optional:**<br />
    `order_id:[string]`<br />
    `item_id:[string]`<br />
* **Request body**<br />
    * **Create:**<br />
    `status:[string]`<br />
    `user_id:[string]`<br />
    * **Update:**<br />
    `id:[string]`<br />
    `status:[string]`<br />
    `user_id:[string]`<br />
    * **Add new item:**<br />
    `quantity:[number]`<br />
    `order_id:[string]`<br />
    `product_id:[string]`<br />
    * **Update item quantity:**<br />
    `id:[string]`<br />
    `quantity:[number]`<br />
* **Success Response:**<br />
    * **Code:** 200 <br />
        **Content:** `Order (show, update, delete)`<br />
    * **Code:** 200 <br />
        **Content:** `Array<CartItem> (show order items, most recent purchases)`<br />
    * **Code:** 200 <br />
        **Content:** `Item (add item, update item, delete item)`<br />
* **Error Response:**<br />
    * **Code:** 404 <br />
        **Content:** `{ error : "No results found" }`<br />
    * **Code:** 401 <br />
        **Content:** `{ error : "Not authorized (no token was sent or invalid token)" }`  <br />
    * **Code:** 400 <br />
        **Content:** `{ error : "Invalid Data" }`  <br />
    * **Code:** 500 <br />
        **Content:** `{ error : "Internal server error" }` <br />
* **Satisfied requirements:**
    * **Orders:**<br />
        * Show [token and correct user id required]: GET `/api/orders/<order_id>`
        * Show order details [token and correct user id required]: GET `/api/orders/<order_id>/items`
        * Create [token required]: POST `/api/orders`
        * Update [token required and correct user id required]: PUT `/api/orders/<order_id>`
        * Delete [token required and correct user id required]: DELETE `/api/orders/<order_id>`
        * Add new item [token required and correct user id required]: POST `/api/orders/<order_id>/items`
        * Update item [token required and correct user id required]: PUT `/api/orders/<order_id>/items/<item_id>`
        * Delete item [token required and correct user id required]: DELETE `/api/orders/<order_id>/items/<item_id>`
        * Get a list of 5 most recent purchases made by logged in user [token required]: GET `/api/dashboard/most_recent`
