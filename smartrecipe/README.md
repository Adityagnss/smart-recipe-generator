# Smart Recipe App

![Smart Recipe Logo](https://img.icons8.com/color/96/000000/cooking-book.png)

> An AI-powered recipe management application with advanced image recognition and social features.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [API Endpoints](#api-endpoints)
- [Contributors](#contributors)
- [License](#license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure login and registration with JWT tokens |
| **Recipe Generator** | AI-powered recipe suggestions based on ingredients |
| **Recipe Lens** | **NEW!** Food image recognition technology that suggests matching recipes |
| **Grocery List** | Manage shopping lists with easy adding and removing items |
| **Flavor Memories** | Record nostalgic food memories and experiences |
| **Community Recipes** | **IMPROVED!** Share, like, and comment on recipes with proper user attribution |
| **Chatbot Assistant** | **UPDATED!** Get help using Google's Gemini AI technology |

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database for flexible data storage
- **JWT**: JSON Web Tokens for secure authentication
- **Multer**: Middleware for handling file uploads
- **Python**: For image recognition processing

### Frontend
- **React**: Component-based UI library
- **React Router**: For navigation and routing
- **React Bootstrap**: Responsive UI components
- **FontAwesome**: Icon library
- **Axios**: Promise-based HTTP client
- **Context API**: For state management

### AI & Machine Learning
- **Google Gemini API**: Powers the intelligent chatbot assistant
- **TensorFlow**: Machine learning framework for image recognition
- **DenseNet201**: Pre-trained model for food image classification
- **RecipeLens Integration**: External service for enhanced recipe suggestions

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v14+)
- **MongoDB** Atlas account or local MongoDB installation
- **Python 3.x** with TensorFlow installed
- **npm** or **yarn** package manager

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   cd smartrecipe
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   - Create a `.env` file in the root directory with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```
   This starts both the backend server and React frontend concurrently.

---

## 📁 Project Structure

```
smartrecipe/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/                # React source files
│       ├── components/     # UI components
│       │   ├── chatbot/    # Chatbot components
│       │   ├── community/  # Community recipe components
│       │   └── recipe-generator/ # Recipe Lens components
│       ├── context/        # Context API state
│       └── utils/          # Utility functions
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # API routes
├── scripts/                # Python scripts for image recognition
├── uploads/                # Temporary storage for uploaded images
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── server.js              # Express server entry point
```

---

## 🌟 Key Features

### 📸 Recipe Lens
The Recipe Lens feature uses advanced image recognition technology to identify food items in uploaded images and suggest matching recipes.

**How it works:**
1. User uploads a food image or takes a photo
2. Image is sent to the RecipeLens processing server
3. AI model identifies food items in the image
4. System matches identified foods with recipes in the database
5. Matching recipes are displayed to the user

**Technical Implementation:**
- Frontend interface for image upload and camera capture
- Backend integration with RecipeLens Django application
- Fallback mechanism using a simplified Python script when RecipeLens is unavailable
- Responsive design with modern UI elements

### 👥 Community Recipes
The Community Recipes feature allows users to share their recipes with others, like and comment on recipes, and build a social cooking community.

**Recent improvements:**
- ✅ Enhanced user attribution showing actual author names for each recipe
- ✅ Improved recipe card design with clear authorship information
- ✅ Better comment display with proper user attribution
- ✅ Streamlined recipe sharing process

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth` - Login user
- `GET /api/auth` - Get logged in user
- `POST /api/users` - Register user

### Recipes
- `GET /api/recipes/community` - Get public recipes
- `GET /api/recipes/user` - Get user's recipes
- `POST /api/recipes` - Create recipe
- `POST /api/recipes/generate` - Generate recipe with AI
- `PUT /api/recipes/save/:id` - Save recipe to collection
- `PUT /api/recipes/like/:id` - Like a recipe
- `POST /api/recipes/comment/:id` - Comment on a recipe

### Recipe Generator
- `POST /api/recipe-generator/upload` - Upload food image and get matching recipes

### Grocery Lists
- `GET /api/grocery` - Get user's grocery lists
- `POST /api/grocery` - Create grocery list
- `PUT /api/grocery/:id` - Update grocery list
- `DELETE /api/grocery/:id` - Delete grocery list
- `POST /api/grocery/add-item/:id` - Add item to grocery list
- `DELETE /api/grocery/remove-item/:id/:item_id` - Remove item from grocery list

### Flavor Memories
- `GET /api/memories` - Get user's flavor memories
- `POST /api/memories` - Create memory
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory

### Chatbot
- `POST /api/chatbot` - Send message to Gemini-powered chatbot

---

## 👨‍💻 Contributors

- **Thaniya & Vyshanvi** - Project Development
- **Supervised by Aditya**

---

## 📄 License

This project is licensed under the MIT License.
