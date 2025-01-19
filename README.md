# AI-Powered Spiritual Guide 🌟

A comprehensive spiritual guidance platform that leverages AI to provide personalized astrological insights, recommendations, and spiritual practices.

## 🔮 Overview

AI-Powered Spiritual Guide combines traditional spiritual wisdom with modern AI technology to deliver personalized guidance. The system analyzes user birth details to provide tailored recommendations for spiritual practices, gemstones, and lifestyle adjustments.

## ✨ Features

### Birth Data Analysis
- Process user inputs:
  - Name
  - Date of Birth
  - Time of Birth
  - Gender
  - Location (State/City)
  - Coordinates (auto-generated)

### Core Functionality
1. **Personalized Recommendations**
   - Gemstone suggestions based on birth chart
   - Customized ritual (pooja) recommendations
   - do's and don'ts
   - Spiritual practice timing optimization

2. **Wellness Integration**
   - Meditation guidance
   - Sleep optimization content
   - Lifestyle adjustment suggestions

3. **Interactive Chatbot**
   - Explanation of astrological concepts
   - Ritual guidance and clarifications
   - Real-time spiritual advice

## 🛠 Tech Stack

### Frontend
- React.js

### Backend
- Node.js
- Express
- Langflow
- AstraDB (Cassandra)


## 📂 Project Structure

## 🚀 Setup Instructions

### Prerequisites
- Node.js
- AstraDB account
- Langflow installation
- Required API keys

### Environment Setup
```bash
# Clone repository
git clone https://github.com/amarjeetpatidar007/ForTheWin-socialbuddy

# Frontend setup
cd client
npm install
cp .env.example .env.local
# Configure environment variables

# Backend setup
cd ../server
npm install
cp .env.example .env
# Configure environment variables

# Database setup
npm run db:setup
```

### AstraDB Configuration
1. Create database in Astra console
2. Configure connection settings:
```env
ASTRA_DB_ID=your-db-id
ASTRA_DB_REGION=your-region
ASTRA_DB_KEYSPACE=your-keyspace
ASTRA_DB_APPLICATION_TOKEN=your-token
```

### Langflow Setup
1. Install Langflow
```bash
pip install langflow
```
2. Configure custom components
3. Import flows from `/langflow/flows`



## 💾 Database Schema

### AstraDB Tables

```sql
-- User profile
CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  name TEXT,
  birth_date DATE,
  birth_time TIME,
  gender TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  created_at TIMESTAMP
);


## 🌐 Deployment

### Production Deployment
1. Build frontend:
```bash
cd client
npm run build
```

2. Deploy backend:
```bash
cd server
npm run deploy
```

3. Configure production environment variables

### Monitoring
- Application metrics
- Error tracking
- Performance monitoring
- User analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

This project is licensed under the MIT License.

---

