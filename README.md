# YouTwitter Backend

A production-ready, highly performant Node.js & Express REST API that serves as the engine for YouTwitter. This platform merges the long-form media streaming mechanics of YouTube with the microblogging dynamics of Twitter. 

The architecture features a robust dual-token JWT authentication strategy, custom multi-layer middleware, disk-to-cloud media pipelines, and highly optimized MongoDB aggregation pipelines for relational data matching.

---

## Backend System Architecture

The server adheres to a clean, modular Model-Controller-Route design pattern (MVC, omitting client views) and mounts all resource endpoints under the `/api/v1` namespace.

```mermaid
graph TD
    Client[HTTP Client] -->|Express Middleware Stack| CORS[CORS Check]
    CORS --> CookieParser[Cookie Parser]
    CookieParser --> BodyParsers[JSON & URLencoded Parsers]
    BodyParsers --> Static[Static Server /public]
    Static --> Router[Express Router]
    
    subgraph Route Execution
        Router --> verifyJWT{Verify JWT Cookie?}
        verifyJWT -->|Yes / Required| AuthMW[Auth Middleware]
        verifyJWT -->|No / Optional| MulterMW[Multer Middleware]
        AuthMW --> MulterMW
        MulterMW --> Controllers[Controllers]
    end
    
    subgraph Data & Storage Layers
        Controllers -->|Uploads| Cloudinary[Cloudinary CDN SDK]
        Controllers -->|Mongoose Queries| MongoDB[(MongoDB Atlas)]
    end

src/
├── db/           # MongoDB Atlas connection & configuration
├── models/       # Mongoose Schemas (User, Video, Tweet, etc.)
├── controllers/  # Core business logic & database interaction
├── routes/       # Express route definitions mapped to controllers
├── middlewares/  # Authentication guards & multipart file handlers
├── utils/        # Global error classes, response formatters, & helpers
├── app.js        # Express application configuration & global middleware
└── index.js      # App bootstrapper & environment initialization


git clone https://github.com/TanmoyD24/YouTwitter.git
cd youtwitter
npm install

PORT=8000
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_secret_hash_value_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret_hash_value_here
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

npm run dev

The system will start by default on http://localhost:8000. You can ping the live server architecture at http://localhost:8000/api/v1/healthcheck.