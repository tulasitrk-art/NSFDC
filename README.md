# NSFDC Concessional Loan Digital Portal

> **National Scheduled Castes Finance and Development Corporation (NSFDC)**  
> *Ministry of Social Justice and Empowerment, Government of India*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL / PostGIS](https://img.shields.io/badge/PostGIS-16--3.4-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgis.net/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🖼️ Application Preview

<p align="center">
  <img width="100%" alt="Portal Home & Hero" src="https://github.com/user-attachments/assets/623713b3-fc7c-4240-9b74-99bc88f75289" />
</p>

<p align="center">
  <img width="100%" alt="Voice-First Intake & Language Selection" src="https://github.com/user-attachments/assets/16760e47-4808-4af1-a614-7baebf0244e3" />
</p>

<p align="center">
  <img width="100%" alt="Interactive Amortization & Scheme Simulator" src="https://github.com/user-attachments/assets/c2b9fcc4-6f96-4df7-92bb-d04e23bc8ade" />
</p>

<p align="center">
  <img width="100%" alt="AI/OCR Certificate Verification" src="https://github.com/user-attachments/assets/ad8f38b5-b933-4bb0-8bd5-85f0bc37bc57" />
</p>

<p align="center">
  <img width="100%" alt="PostGIS Channel Partner Routing Map" src="https://github.com/user-attachments/assets/0c10cf72-c09a-4f7e-b7a0-a107b6b57a06" />
</p>

<p align="center">
  <img width="100%" alt="Officer Dashboard & Live Lead Pipeline" src="https://github.com/user-attachments/assets/7439cad6-75cc-4e3f-8e04-60561f995c20" />
</p>

---

## 📌 Overview

The **NSFDC Concessional Loan Digital Portal** is an inclusive civic-fintech platform engineered under the aegis of the Ministry of Social Justice and Empowerment (Govt. of India). It bridges the digital divide for marginalized beneficiaries by offering **vernacular voice-first loan intake** across 8 Indian languages, **AI/OCR-based instant document verification**, an **algorithmic scheme matching and amortization engine**, and **interactive PostGIS geospatial branch routing** to connect citizens with State Channelizing Agencies (SCAs) seamlessly.

---

## ✨ Key Features

* 🎙️ **Multilingual Voice Intake**: Real-time speech recognition and NLP entity extraction for 8+ Indian regional languages (Hindi, Tamil, Telugu, Kannada, Bengali, Gujarati, Marathi, English).
* 📄 **AI-Powered OCR Verification**: Automated extraction and pre-screening of caste and income certificates to prevent fraud and expedite approvals.
* ⚡ **Algorithmic Eligibility & Scheme Engine**: Dynamic rules matching applicants to NSFDC concessional loan schemes with live amortization and EMI schedules.
* 🗺️ **PostGIS Channel Partner Routing**: Geolocation-based routing connecting applicants to the nearest regional SCAs, RRBs, and partner banks.
* 🏛️ **Dual Portal Architecture**: Transparent self-service citizen tracker alongside an intuitive workflow suite for loan sanctioning officers.

---

## 🛠️ Architecture & Tech Stack

```
nsfdc-concessional-portal/
├── backend/                  # FastAPI REST Microservices
│   ├── app/
│   │   ├── api/v1/          # Endpoints (auth, ocr, financial, routing, voice)
│   │   ├── core/            # Config, security, scheme constants
│   │   ├── db/              # SQLAlchemy session & init scripts
│   │   ├── models/          # ORM data models (Applicant, Scheme, Partner)
│   │   └── services/        # Financial engine, OCR parser, PostGIS router
│   └── tests/               # Pytest automated test suites
├── frontend/                 # Next.js 14 App Router
│   ├── src/app/             # Pages (apply, schemes, track, channels, officer)
│   ├── src/components/      # UI, Voice Intake, OCR upload, Geo Map, Calculator
│   ├── src/context/         # Multilingual i18n context
│   └── src/locales/         # Language translation dictionaries
└── docker-compose.yml       # Multi-container orchestration (DB, API, Web)
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10+)
* **PostgreSQL with PostGIS** *(or Docker)*

### 1. Clone the Repository
```bash
git clone https://github.com/tulasitrk-art/NSFDC.git
cd NSFDC
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Web App: [http://localhost:3000](http://localhost:3000)

### 4. Running via Docker Compose
```bash
docker-compose up --build
```

---

## 🧪 Testing

Execute automated unit tests for the financial engine and verification algorithms:
```bash
cd backend
python -m pytest
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
