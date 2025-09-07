# Commodity

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [AI Features Setup](#ai-features-setup)
- [Getting Started](#getting-started)
- [Contact](#contact)

## About

**Commodity** is a e-commerce platform built with the MERN stack, focused on delivering a smooth shopping experience for users and providing admin tools for inventory and order management. The project now integrates a powerful AI chatbot, **Comma**, to provide real-time, context-aware support.

## Features

### Core E-Commerce Features

- **User Authentication**: Secure registration and login using JWT.
- **Admin Panel**: Dedicated admin section for managing inventory and listings.
- **Product Listings**: Browse available products with advanced search and filtering.
- **Shopping Cart**: Add, update, or remove products before checkout.
- **Inventory Management (Admin)**: Add, update, or delete products and manage stock levels.
- **Location-Aware Delivery**: Users can input precise delivery details via interactive maps.
- **Web Sockets**: Real-time notification between users and admin on orders and status updates.

### AI Chatbot Features

- **Conversational Assistant**: **Comma** provides instant answers to product questions and company policy inquiries.
- **Retrieval-Augmented Generation (RAG) and Tools**: The chatbot retrieves information from the product database and website pages to provide accurate, up-to-date responses.
- **Real-Time Streaming**: Uses Server-Sent Events (SSE) for a dynamic, token-by-token response display.
- **Microservice Architecture**: The AI chatbot is a separate Python backend for enhanced performance and scalability.

## Technology Stack

### Frontend

- **Framework**: Next.js (App Router) & React
- **Styling**: Tailwind CSS & Shadcn/ui
- **State Management**: Redux Toolkit & TanStack Query
- **Data Fetching**: Axios & Server-Sent Events (SSE) with the native Fetch API
- **Mapping**: Leaflet & Geoapify
- **Forms**: Formik & Yup

### Backend (Express.js)

- **Server**: Node.js & Express.js
- **Database**: MongoDB Atlas & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Real-time**: Socket.io

### Backend (FastAPI / AI)

- **API Framework**: FastAPI
- **Orchestration**: LangGraph
- **Tooling**: `fastmcp` & LangChain
- **LLM Integration**: `langchain-ollama` (using `hf.co/unsloth/Qwen3-4B-Instruct-2507-GGUF:Q4_K_M`)
- **Database Integration**: `langchain-mongodb` & `pymongo`
- **Web Scraping**: `beautifulsoup4` & `playwright`
- **Embeddings**: `sentence-transformers` (`all-MiniLM-L6-v2`)

## Getting Started

To run the app locally:

### Prerequisites

- Node.js (LTS recommended)
- Python 3.10+
- MongoDB Atlas( Vector indexing is only suppported in Atlas )
- Ollama
- recommended RAM availablility: 16 GB

1. **Clone the repository**:

   ```bash
   git clone https://github.com/angeltamang123/Commodity.git
   cd Commodity
   ```

2. **MongoDB Atlas**:

   1. Create MongoDB Atlas free account.
   2. Create a free cluster.
   3. Security/Database Access: Create Database User which has read and write access to any database.
   4. Security/Network Access: Make your cluster connectable from any ip address 0.0.0.0/0
   5. Click connect on your free cluster, and choose Drivers.
   6. You can find connection string that looks like `mongodb+srv://<User with db write access>:<db_password>@cluster0.yea60.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` which will be important while setting environment variables.

3. **Geoapify**:
   Get a free api key to perform geocoding and reverse-geocoding from [Geoapify](https://www.geoapify.com/get-started-with-maps-api/)

4. **Set up Environment Variables**: Create a `.env` file in for each Server

   - **Frontend Setup**:
     Inside /Commodity/client directory create a `.env` file and create these variables:

   ```bash
   NEXT_PUBLIC_EXPRESS_API_URL=<Locally hosted express server. Eg: http://localhost:7000. The port number must match with the EXPRESS_PORT variable in express backend>
   NEXT_PUBLIC_FASTAPI_URL=<Locally hosted fastapi server. Eg: http://localhost:8001. The port number must match with the FASTPI_PORT variable in fastapi backend>
   NEXT_PUBLIC_GEOAPIFY_KEY=<API key from Geoapify>
   JWT_SECRET= <JWT Secret, must match with the JWT_SECRET variable in express backend>
   ```

   - **Express.js Backend Setup**:
     Here, It is important the variables connecting to atlas database is setup correctly, remember your string `mongodb+srv://<User with db write access>:<db_password>@cluster0.yea60.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`. Inside /Commodity/express_server directory create a `.env` file and create these variables:

   ```bash
   JWT_SECRET = <JWT Secret, must match with the JWT_SECRET variable in Client directory>
   EXPRESS_PORT = <Port where express runs eg: 7000>
   CLIENT_URL=<Locally hosted nextjs app. Eg: http://localhost:3000. The port number 3000 is default to nextjs>
   FASTAPI_URL=<Locally hosted fastapi server. Eg: http://localhost:8001. The port number must match with the FASTPI_PORT variable in fastapi backend>
   MONGODB_USER=<User with db write access>
   MONGODB_CLUSTER=<copy paste this part from your string "cluster0.yea60.mongodb.net">
   MONGODB_PASSWORD=<db_password>
   MONGODB_DB=<The name of database for this project>
   ```

   - **FastAPI/AI Backend Setup**:
     Inside /Commodity/fastapi_server directory create a `.env` file and create these variables:

   ```bash
   FASTAPI_PORT=<Port where express runs eg: 8001>
   MONGODB_USER=<User with db write access>
   MONGODB_CLUSTER=<copy paste this part from your string "cluster0.yea60.mongodb.net">
   MONGODB_PASSWORD=<db_password>
   MONGODB_DB=<The name of database for this project>
   CLIENT_URL=<Locally hosted nextjs app. Eg: http://localhost:3000. The port number 3000 is default to nextjs>
   ```

   The Mongodb variables, CLIENT_URL in express and fastapi directories must match

### Installation

1.  **Frontend Setup**:

    ```bash
    cd client
    npm install
    ```

    Or other node package managers of your liking.

2.  **Express.js Backend Setup**:
    In another terminal

    ```bash
    cd express_server
    npm install
    ```

3.  **FastAPI/AI Backend Setup**:
    In another terminal and in python virtual environment:
    ```bash
    cd fastapi_server
    pip install -r requirements.txt
    ```
    you can use **uv** to manage your python packages if you'd like.

### Running the Project

1.  Start the Express.js backend server:

    ```bash
    cd server
    npm run dev
    ```

2.  Start the FastAPI/AI backend server:
    Before running fastapi server you need to complete setup for [AI, check the section below](#ai-features-setup).
    And make sure you're in your python virtual environment where the packages are installed.

    ```bash
    cd fastapi_server
    python main.py
    ```

    Wait for both fastapi and fastmcp server to start.

3.  Start the Next.js frontend server:

    ```bash
    cd express_server
    npm run dev
    ```

Open your browser to `http://localhost:3000` where nextjs should runs by default.

## AI Features Setup

To run the AI chatbot locally, you need to set up the LLM and vector database. It is recommended to have at-least 16 GB of RAM, for no GPU inference, for all this project's features to run smoothly.

1.  **Install and Run Ollama**: Start the Ollama server to serve the local LLM.

    ```bash
    ollama serve # Note: On Linux, this may run as a service by default on installation
    ```

    Install Ollama from [official site](https://ollama.com/download/linux)

2.  **Pull the LLM**: Pull the specific LLM model on [Huggingace](https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507-GGUF) used for the chatbot.

    ```bash
    ollama pull hf.co/unsloth/Qwen3-4B-Instruct-2507-GGUF:Q4_K_M
    ```

    Or you could use 8/16 bit quantized variants if you have larger memory available.

3.  **Create a Local Alias**: Create a local alias for the model to match the backend code.

    ```bash
    ollama cp hf.co/unsloth/Qwen3-4B-Instruct-2507-GGUF:Q4_K_M commodity-ai
    ```

4.  **Vector Embedding**: The [`all-MiniLM-L6-v2` embedding model](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) will be automatically downloaded by the Python backend.

5.  **Data Ingestion & Indexing**: Before running the AI backend, you must vectorize your product data and create a vector index.
    - **Vector Index**: Navigate to the `fastapi_server` directory and run following script to create a vector index:
      ```bash
      cd fastapi_server
      python vector_index.py
      ```
    - **Ingestion**: If FastAPI backend is active during product creation/update then it's embeddings are generated and stored. However, If you have products without embeddings you can always run the ingestion script: Navigate to the `fastapi_server` directory and run following script to populate your product data with vector embeddings.
      ```bash
      cd fastapi_server
      python ingest.py
      ```

## Contact

If you'd like to contribute or have any questions:

- **Project Name**: Commodity
- **Maintainer**: Angel Tamang
- **Email**: tamangangel2057@gmail.com
- **GitHub**: [https://github.com/angeltamang123](https://github.com/angeltamang123)
