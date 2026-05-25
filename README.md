# SafeBirth AI – Modified Robson Criteria Based C-Section Risk Prediction & Audit Platform

SafeBirth AI is a deployed full-stack healthcare prototype built for C-section risk prediction, Modified Robson group classification, and hospital audit analytics. The platform allows hospital staff to manually enter patient data, classify patients into Modified Robson groups, predict C-section risk using an ML pipeline, monitor high-risk cases, generate reports, export data, and analyze group-wise C-section contribution.

> This project is a clinical decision-support and audit prototype. It is not a clinically validated medical decision-making system. Final delivery decisions must be made by qualified healthcare professionals.

---

## Live Links

- **Frontend Live App:** https://riskprediction-frontend.vercel.app
- **Backend API:** https://riskprediction-backend.vercel.app
- **ML Health Check:** https://riskprediction-ml.vercel.app/health
- **GitHub Repository:** https://github.com/Greeshmasree76/RiskPrediction

---

## Demo Login Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| Admin | admin@safebirth.ai | admin123 | Full platform access |
| Doctor | doctor@safebirth.ai | doctor123 | Patient entry, prediction, audit, reports |
| Nurse / Staff | nurse@safebirth.ai | nurse123 | Patient registration and records |
| Data Analyst | analyst@safebirth.ai | analyst123 | Analytics, audit, reports, export |

---

## Key Features

- Role-based login for Admin, Doctor, Nurse/Staff, and Data Analyst
- Real-time manual patient data entry
- Modified Robson group classification
- ML-based prototype risk prediction
- Risk score generation
- High-risk alert popup
- Patient records management
- Group-wise C-section contribution analysis
- Highest and lowest contributing Robson group detection
- Benchmark comparison
- Intervention tracking
- Actual delivery outcome tracking
- Maternal and neonatal care-quality indicators
- Data quality monitoring
- PDF report generation
- CSV and JSON export
- Telugu / English language switch
- AI help chat box
- Profile, Resources, Support, and Settings pages
- Fully deployed frontend, backend, and ML service

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Recharts
- jsPDF
- jsPDF AutoTable
- Axios
- Vercel Deployment

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Axios
- CORS
- dotenv
- Vercel Deployment

### ML Service
- Python
- Flask
- Flask-CORS
- scikit-learn
- pandas
- joblib
- Random Forest Classifier
- Vercel Deployment

---

## Project Architecture

```text
React Frontend
   ↓
Node.js / Express Backend
   ↓
Python Flask ML Service
   ↓
MongoDB Atlas Database