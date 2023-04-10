
# German Capital Pharmacy

An online website for pharmacies and customers to join via shopping sites for doing business with medical products.
Customers log in to the website and browse the shopping page.
Pick up the favorite one(product) and checkout.
Receive the invoice from German Capital Pharma regarding thier bucket goods items.
Admin Users log in to the admin panel and manages users, products and invoices.
The site can be translated for both of EN/DE readers.

### Stack using for the project
- Node.js (Backend)
- React.js (Frontend)
- React Admin framework (Admin Panel)
- MongoDB (Database)
- SendGrid (Emailing Third-Pary)
- Heroku (Testing Platfrom)
- Hetzner (Hosting for production)

### How to set up & run
- ***The structure of the project***
```
    - Project (root path)
      -- admin
      -- client
      -- backend
      package.json  
```
- ***Environment Variables***
    ```
        PORT=3333
        NODE_ENV=production
        ADMIN_PASSWORD=password
        MONGO_LOCAL_URL=mongodb://localhost:27017
        MONGO_URL=mongodb+srv://smartit:smartit0226@cluster0.zrk8c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
        JWT_SECRET=gcpharmacy20220226
        ALGOLIA_APP_ID=KY7ZX1X2JE
        ALGOLIA_API_KEY=6c7945b72e026ed9d74b46404fcef6f8
        RECAPTCHA_SKIP_ENABLED=false
        RECAPTCHA_SITE_KEY=6LevyEIfAAAAAPv0YfzGR6TJRsuuBZKfB0eKTPSN
        RECAPTCHA_SECRET_KEY=6LevyEIfAAAAAPh150KjZ9hiwwOPjvGKqokmkPlL
    ```
- ***Build the project***
    1. Admin `(check ./admin/package.json)`
        ```
           "scripts": {
                "analyze": "source-map-explorer 'build/static/js/*.js'",
                "start": "react-scripts start",
                "build": "yarn node ./build.js",    <---
                "eject": "react-scripts test"
            }, 
        ```
        ```
            $ npm run build
        ```
    2. Client `(check ./client/package.json)`
        ```
            "scripts": {
                "start": "react-scripts start",
                "build": "react-scripts build",     <---
                "test": "react-scripts test",
                "eject": "react-scripts eject"
            },
        ```
        ```
            $ npm run build
        ```
- ***Set up the database***

    Configure the database `(check ./backend/config/db.js L#7)`
    ```
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            
        const conn = await mongoose.connect(process.env.MONGO_LOCAL_URL, {
    ```
    Create the database
    ```
        $ npm run data:import
    ```
    Destroy the database
    ```
        $ npm run data:destroy
    ```
- ***Run the project*** `(check ./package.json)`
    
    ```
        "scripts": {
            "dev": "babel backend -d lib && nodemon lib/server.js",     <---
            "start": "babel backend -d lib && node lib/server.js",
            "server": "nodemon backend/server.js",
            "data:import": "node backend/seeder",
            "data:destroy": "node backend/seeder -d",
            "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client && npm install --prefix admin && npm run build --prefix admin",
            "test": "echo \"Error: no test specified\" && exit 1"
        },
    ```
    ```
        $ npm run dev
    ```
- ***Deployment on Hetzer***
    1. Configure `SSH key` on `Hetzner Server` to access repository
    2. Clone the repository and `build the project` based on the above instructions
    3. Install `NVM`, `NPM` and `Node` runtime for running of the server `(check the versions from ./package.json)`
    4. Install `NGINX` and `pm2` module on the server
    5. Configure `NGINX`
        ```
             server { 
                listen       8080; 
                server_name  gc-pharama-account.de.dedi4543.your-server.de; 
                #charset koi8-r; 
                #access_log  logs/host.access.log  main; 
                location / { 
                        proxy_pass http://localhost:3333; 
                        proxy_http_version 1.1; 
                        proxy_set_header Upgrade $http_upgrade; 
                        proxy_set_header Connection 'upgrade'; 
                        proxy_set_header Host $host; 
                        proxy_cache_bypass $http_upgrade; 
                        proxy_set_header X-Real-IP $remote_addr; 
                        proxy_set_header X-Forwarded-For proxy_add_x_forwarded_for; 
                        proxy_set_header X-Forwarded-Host $host; 
                        proxy_set_header X-Forwarded-Proto $scheme; 
                        proxy_set_header X-NginX-Proxy true; 
                }
        ```
    6. Write or Add `Cron-Job Scripts`
        ```
            /usr/home/gcpharma/.linuxbrew/bin/mongod --dbpath /usr/home/gcpharma/mongodb/data/db/ --port 27017 --fork --logpath /usr/home/gcpharma/mongodb/log.txt
            cd /usr/home/gcpharma/gc && /usr/home/gcpharma/.nvm/versions/node/v16.14.0/bin/node /usr/home/gcpharma/gc/lib/server.js
            /usr/home/gcpharma/.linuxbrew/bin/nginx
            crontab -l | { cat; echo "@reboot cd $HOME/GermanCapitalPharma/ && $HOME/.nvm/versions/node/v16.14.0/bin/pm2 start $HOME/GermanCapitalPharma/lib/server.js"; } | crontab -
            @reboot cd /usr/home/gcpharma/GermanCapitalPharma && /usr/home/gcpharma/.nvm/versions/node/v16.14.0/bin/node /usr/home/gcpharma/.nvm/versions/node/v16.14.0/bin/pm2 start /usr/home/gcpharma/GermanCapitalPharma/lib/server.js
            @reboot cd /usr/home/gcpharma/GermanCapitalPharma && ./.bashrc	
        ```
    7. Write `./.bashrc` file
        ```
            #!/bin/bash 
            export NVM_DIR="$HOME/.nvm" 
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm 
            cd /usr/home/gcpharma/GermanCapitalPharma &&
            /usr/home/gcpharma/.nvm/versions/node/v16.14.0/bin/node 
            /usr/home/gcpharma/.nvm/versions/node/v16.14.0/bin/pm2 start 
            /usr/home/gcpharma/GermanCapitalPharma/lib/server.js
        ```

## API 
- Users
    1. Authentication
        | Endpoint      | Description |
        | ----------- | ----------- |
        | /users/signup      | Sign up with profile information       |
        | /users/login   | Login with user email and password        |
        | /users/set-password      | Set & Reset user password       |
        | /users/check-email   | Check confirmation email        |
        | /users/forgot-password   | Reset the forgotten password        |
        | /users/check-auth   | Check the current authentication status        |
    2. Profile
        | Endpoint      | Description |
        | ----------- | ----------- |
        | /users/get-profile      | Get user profile information       |
        | /users/profile      | Update user profile information       |
    3. Business License
        | Endpoint      | Description |
        | ----------- | ----------- |
        | /users/upload-license      | Upload the license documents       |
    4. CRUD
        | Endpoint      | Description |
        | ----------- | ----------- |
        | /users/:id (GET)      | Get user information       |
        | /users/:id (PUT)      | Update user information       |
        | /users/:id (DELETE)      | Delete user information       |
- Products
    | Endpoint      | Description |
    | ----------- | ----------- |
    | /products/ (GET)      | Get products list with information       |
    | /products/ (GET)      | Create product (upload images)       |
    | /products/:id (GET)      | Get product information       |
    | /products/:id (PUT)      | Update product information  (upload images)      |
    | /products/:id (DELETE)      | Delete product information       |
- Orders
    | Endpoint      | Description |
    | ----------- | ----------- |
    | /orders/ (GET)      | Get orders list with information       |
    | /orders/ (GET)      | Create order (by Admin)       |
    | /orders/:id (GET)      | Get order information       |
    | /orders/:id (PUT)      | Update order information      |
    | /orders/:id (DELETE)      | Delete order information       |
    | /orders/place (POST)      | Place order information (by Client)      |
    | /orders/list (POST)      | Get order list      |
    | /orders/revenue-date (POST)      | Get orders list by its revenue date      |
    | /orders/revenue-product (POST)      | Get orders list by its revenue product      |
- Invoices
    | Endpoint      | Description |
    | ----------- | ----------- |
    | /invoices/ (GET)      | Get invoice list with information       |
    | /invoices/:id (GET)      | Get the individual invoice information       |
