## Database Tables
### users
|id| first_name | last_name |UNIQUE(user_name)|password_digest
|--|--|--|--|--
|serial primary key| string| string| string| string
### products
|id| name | price
|--|--|--
|serial primary key| string| number
### orders
|id| status | user_id
|--|--|--
|serial primary key| string| foreign key references(users)
### order_items
|id| quantity | order_id | product_id | constriants
|--|--|--|--|--
|serial primary key| string| foreign key references(orders) | foreign key references(products)| UNIQUE(order_id, product_id)

## Data Shapes
#### Product
- id: string
- name: string
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
- price: number
- quantity: number

## Application URL
`http://localhost:5000`
## API Endpoints
### Products
* **URLs**
    `/api/products/<product_id>`
    `/api/dashboard/most_expensive`
    `/api/dashboard/most_popular`
* **Methods:**
    `GET`|`POST`|`PUT`|`DELETE`
* **URL Params**
    **Optional:**
    `product_id:[string]`
* **Request body**
    **Create:**
    `name:[string]`<br />
    `price:[number]`<br />
    **Update:**
    `id:[string]`<br />
    `name:[string]`<br />
    `price:[number]`<br />
* **Success Response:**
    * **Code:** 200 <br />
        **Content:** `Product or Array<Product>`
* **Error Response:**
    * **Code:** 404 <br />
        **Content:** `{ error : "No results found" }`
    * **Code:** 401 <br />
        **Content:** `{ error : "Not authorized (no token was sent or invalid token)" }`  
    * **Code:** 400 <br />
        **Content:** `{ error : "Invalid Data" }`  
    * **Code:** 500 <br />
        **Content:** `{ error : "Internal server error" }` 
* **Satisfied requirements:**
Products:
- Index: GET `/api/products/`
- Show: GET `/api/products/<product_id>`
- Create [token required]: POST `/api/products/`
- Update [token required]: PUT `/api/products/<product_id>`
- Delete [token required]: DELETE `/api/products/<product_id>`
- Get a list of 5 most expensive products: GET `/api/dashboard/most_expensive`
- Get a list of 5 most popular products: GET `/api/dashboard/most_popular`

### Users
* **URLs**
    `/api/users/<user_id>`<br />
    `/api/users/sign_up`<br />
    `/api/users/sign_in`<br />
    `/api/users/<user_id>/orders/active`<br />
    `/api/users/<user_id>/orders/completed`<br />

* **Methods:**
    `GET`|`POST`|`PUT`|`DELETE`
* **URL Params**
    **Optional:**
    `user_id:[string]`
* **Request body**
    **Sign up:**
    `first_name:[string]`<br />
    `last_name:[string]`<br />
    `user_name:[string]`<br />
    `password:[string]`<br />
    **Sign up:**
    `user_name:[string]`<br />
    `password:[string]`<br />
    **Update:**
    `id:[string]`<br />
    `first_name:[string]`<br />
    `last_name:[string]`<br />
    `user_name:[string]`<br />
* **Success Response:**
    * **Code:** 200 <br />
        **Content:** `User or Array<User> (Index, show, update, delete)`
    * **Code:** 200 <br />
        **Content:** `Authorization Token along with a user ID (sign up, sign in)`
    * **Code:** 200 <br />
        **Content:** `List of active or completed orders in the form Array<{order_id: string, order_status: string, order_details: Array<CartItems>}>`
* **Error Response:**
    * **Code:** 404 <br />
        **Content:** `{ error : "No results found" }`
    * **Code:** 401 <br />
        **Content:** `{ error : "Not authorized (no token was sent or invalid token)" }`  
    * **Code:** 400 <br />
        **Content:** `{ error : "Invalid Data" }`  

    * **Code:** 500 <br />
        **Content:** `{ error : "Internal server error" }` 
* **Satisfied requirements:**
Users:
- Index [token required]: GET `/api/users`
- Show  [token and correct id required]: GET `/api/users/<user_id>`
- Sign up: POST `/api/users/sign_up`
- Sign in: POST `/api/users/sign_in`
- Update [token and correct id required]: PUT `/api/users/<user_id>`
- Delete [token and correct id required]: DELETE `/api/users/<user_id>`
Products:
- Detailed Current Active Orders by user [token and correct id required]: GET `/api/users/<user_id>/orders/active`
- Detailed List of Completed Orders by user [token and correct id required]: GET `/api/users/<user_id>/orders/completed`


### Orders
* **URLs**
    `/api/orders/<order_id>`
    `/api/orders/<order_id>/items/<item_id>`
    `/api/dashboard/most_recent`
* **Methods:**
    `GET`|`POST`|`PUT`|`DELETE`
* **URL Params**
    **Optional:**
    `order_id:[string]`
    `item_id:[string]`
* **Request body**
    **Create:**
    `status:[string]`<br />
    `user_id:[string]`<br />
    **Update:**
    `id:[string]`<br />
    `status:[string]`<br />
    `user_id:[string]`<br />
    **Add new item:**
    `quantity:[number]`<br />
    `order_id:[string]`<br />
    `product_id:[string]`<br />
    **Update item quantity:**
    `id:[string]`<br />
    `quantity:[number]`<br />
* **Success Response:**
    * **Code:** 200 <br />
        **Content:** `Order (show, update, delete)`
    * **Code:** 200 <br />
        **Content:** `Array<CartItem> (show order items, most recent purchases)`
    * **Code:** 200 <br />
        **Content:** `Item (add item, update item, delete item)`
* **Error Response:**
    * **Code:** 404 <br />
        **Content:** `{ error : "No results found" }`
    * **Code:** 401 <br />
        **Content:** `{ error : "Not authorized (no token was sent or invalid token)" }`  
    * **Code:** 400 <br />
        **Content:** `{ error : "Invalid Data" }`  
    * **Code:** 500 <br />
        **Content:** `{ error : "Internal server error" }` 
* **Satisfied requirements:**
Orders:
- Show [token and correct user id required]: GET `/api/orders/<order_id>`
- Show order details [token and correct user id required]: GET `/api/orders/<order_id>/items`
- Create [token required]: POST `/api/orders`
- Update [token required and correct user id required]: PUT `/api/orders/<order_id>`
- Delete [token required and correct user id required]: DELETE `/api/orders/<order_id>`
- Add new item [token required and correct user id required]: POST `/api/orders/<order_id>/items`
- Update item [token required and correct user id required]: PUT `/api/orders/<order_id>/items/<item_id>`
- Delete item [token required and correct user id required]: DELETE `/api/orders/<order_id>/items/<item_id>`
- Get a list of 5 most recent purchases made by logged in user [token required]: GET `/api/dashboard/most_recent`
