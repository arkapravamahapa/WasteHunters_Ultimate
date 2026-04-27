<div align="center">
  
♻️ WasteHunters
**AI-Powered E-Waste Classification & Recycling Incentive Platform**

[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](#)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688?logo=fastapi&logoColor=white)](#)
[![Database](https://img.shields.io/badge/Database-Supabase%20%7C%20PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](#)
[![AI](https://img.shields.io/badge/AI_Vision-Gemini%202.0%20Flash-4285F4?logo=google&logoColor=white)](#)
[![Deployment](https://img.shields.io/badge/Live-Vercel%20%7C%20Render-success)](#)

[View Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 About The Project

Electronic waste is one of the fastest-growing environmental hazards globally. **WasteHunters** bridges the gap between complex recycling processes and everyday users by gamifying e-waste disposal. 

Using multimodal AI (Google Gemini 2.0 Flash), the application allows users to snap a photo of any discarded electronic item. The system instantly identifies the component, estimates recoverable precious metals (like Gold and Copper), calculates the potential carbon offset, and rewards the user with "Green Tokens" for properly dropping the item at a certified recycling hub.

✨ Key Features
* 🔍 **AI Hunter Tool:** Real-time computer vision classification of e-waste components.
* 💰 **Token Economy:** Secure claiming and tracking of Green Tokens to incentivize recycling.
* 📊 **Impact Dashboard:** Interactive visualization of user-generated carbon offsets and materials recovered.
* 🗺️ **Live Drop-off Map:** Interactive geospatial mapping to locate nearby certified recycling facilities.
* 🛡️ **Toxicity Alerts:** Automated warnings for hazardous materials (e.g., lithium, lead).

---

## 🛠️ Technology Stack

 **Client-Side (Frontend)**
* **Core:** React.js 18, Vite
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Data Visualization:** Recharts, Leaflet.js (Interactive Maps)
* **Hosting:** Vercel Global Edge Network

### **Server-Side (Backend)**
* **Core:** Python 3.11, FastAPI, Uvicorn
* **AI Integration:** Google GenAI SDK (`gemini-2.0-flash`)
* **Hosting:** Render Cloud Services

### **Database & Architecture**
* **Database:** PostgreSQL managed via Supabase
* **Communication:** RESTful HTTPS API with Cross-Origin Resource Sharing (CORS) handling

---

## 🏗️ System Architecture

Our system is cleanly decoupled, ensuring the React client handles presentation while the FastAPI backend securely manages database transactions and heavy AI processing.

```mermaid
flowchart TD
    classDef frontend fill:#000000,stroke:#ffffff,color:#fff,stroke-width:2px,stroke-dasharray: 5 5;
    classDef backend fill:#1e293b,stroke:#3b82f6,color:#fff,stroke-width:2px;
    classDef database fill:#10b981,stroke:#047857,color:#fff,stroke-width:2px;
    classDef ai fill:#8b5cf6,stroke:#6d28d9,color:#fff,stroke-width:2px;
    classDef user fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:2px;

    User((Eco-Warrior\nBrowser / Mobile)):::user

    subgraph VERCEL ["Vercel Edge Network (Frontend)"]
        React["⚛️ React + Vite UI\n(Hunter Page, Dashboard)"]:::frontend
    end

    subgraph RENDER ["Render Cloud (Backend)"]
        FastAPI["🐍 FastAPI Server\n(Python API Endpoints)"]:::backend
    end

    Supabase[("🗄️ Supabase\n(PostgreSQL Database)")];
    class Supabase database;
    
    Gemini["🧠 Google Gemini 2.0\n(AI Vision Model)"];
    class Gemini ai;

    User <==>|1. Interacts with UI| React
    React <==>|2. REST API / HTTPS| FastAPI
    FastAPI <==>|3. SQL Read / Write| Supabase
    FastAPI <==>|4. Sends Image Blob| Gemini
