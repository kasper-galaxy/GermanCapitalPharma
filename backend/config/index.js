const username = "smartit"
const password = "smartit0226"
const cluster = "cluster0.zrk8c"
const dbname = "myFirstDatabase"

const config = {
    NODE_ENV: 'production',
    MONGO_LOCAL_URL: 'mongodb://localhost:27017',
	DOMAIN: 'gc-pharma-account.de.dedi4543.your-server.de',
	MONGO_URL : `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
    ADMIN_PASSWORD: 'password',
    RESET_PASSWORD: '123456',
    JWT_SECRET: 'pM48uAEspkS5BmfX',
	ALGOLIA_APP_ID : "KY7ZX1X2JE",
	ALGOLIA_API_KEY : "6c7945b72e026ed9d74b46404fcef6f8",
	RECAPTCHA_SKIP_ENABLED: false,
	RECAPTCHA_SITE_KEY: '6LevyEIfAAAAAPv0YfzGR6TJRsuuBZKfB0eKTPSN',
	RECAPTCHA_SECRET_KEY: '6LevyEIfAAAAAPh150KjZ9hiwwOPjvGKqokmkPlL'
};

export default config;