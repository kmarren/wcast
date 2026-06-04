# Women's College Basketball Prediction Platform

A full-stack machine learning application that predicts NCAA Division I Women's Basketball game outcomes using historical performance data and explainable AI techniques.

This project extends a machine learning research study into a production-style web application, allowing users to generate predictions, explore model explanations, and interact with trained models through a modern web interface.

---

## Overview

Women's college basketball has experienced significant growth in competitiveness and parity in recent years, making game outcome prediction increasingly challenging.

This project began as a machine learning research initiative investigating whether historical team performance metrics could accurately predict game outcomes. After evaluating multiple predictive models and explainability techniques, the project was expanded into a full-stack application capable of serving predictions through a web interface.

The result is a system that combines:

- Data engineering
- Machine learning
- Explainable AI (XAI)
- Backend API development
- Frontend application development

---

## Key Features

- Predict NCAA Women's Basketball game outcomes
- Compare team performance prior to matchup
- Interactive web interface
- REST API backend
- Machine learning model deployment
- Historical data processing pipeline

---

## Screenshots

### Home Page
<img width="1507" height="809" alt="Screenshot 2026-06-03 at 9 10 03 PM" src="https://github.com/user-attachments/assets/fb44cb9f-4856-4385-a01d-c633e8bb3809" />

### About Page
<img width="1509" height="796" alt="Screenshot 2026-06-03 at 9 10 37 PM" src="https://github.com/user-attachments/assets/2a4de2ef-8fe4-4928-aa4c-0692abca9eab" />

### Prediction Interface
<img width="1508" height="817" alt="Screenshot 2026-06-03 at 9 12 02 PM" src="https://github.com/user-attachments/assets/bf6bda97-0df3-45ef-b1c2-91a156d7b97b" />
<img width="1507" height="818" alt="Screenshot 2026-06-03 at 9 12 40 PM" src="https://github.com/user-attachments/assets/d02bca13-5dc5-4b34-af43-5a655e212957" />

### Prediction Results
<img width="1506" height="817" alt="Screenshot 2026-06-03 at 9 13 16 PM" src="https://github.com/user-attachments/assets/ae50d0b4-6bea-4c91-95b0-dd947e6ed9b3" />

---
## Research Foundation

This application is built on a machine learning research project using historical NCAA Division I Women's Basketball game data.

### Dataset

- 6,024 unique games
- NCAA Division I Women's Basketball
- Sports Reference game data
- Warren Nolan strength-of-schedule metrics

### Feature Engineering

To avoid data leakage, game statistics that directly reflected outcomes were excluded.

Instead, features were engineered using only information available before each game:

- Team win percentage before game date
- Opponent win percentage before game date
- Team games played before game date
- Opponent games played before game date
- Team identity
- Opponent identity

During development, several data quality and bias issues were identified and resolved, including duplicate game records and label imbalance caused by team/opponent ordering.

### Models Evaluated

- Logistic Regression
- Random Forest

### Results

| Model | F1 Score | AUC ROC |
|---------|---------|---------|
| Logistic Regression | 0.740 | 0.819 |
| Random Forest | 0.639 | 0.778 |

---

## Why This Project

After completing the initial machine learning research, I wanted to explore how predictive models can be transformed into usable software products.

This application extends the original research by:

- Deploying trained machine learning models
- Building a backend prediction service
- Creating a web-based user experience
- Integrating explainability visualizations
- Connecting research outputs to a production-style system

---

## Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS

### Backend

- Django
- Python

### Machine Learning

- Scikit-learn
- Pandas
- NumPy

### Data Sources

- Sports Reference
- Warren Nolan Ratings

---

## My Contributions

I independently developed the machine learning and backend components of this project, including:

- Data collection and cleaning
- Feature engineering
- Model development
- Hyperparameter tuning
- Model evaluation
- Backend API development
- Full-stack integration
- System architecture design

### Frontend Note

The frontend was initially scaffolded using Lovable and subsequently customized and integrated into the application. My primary contributions focused on machine learning, data engineering, backend development, deployment, and full-stack integration.

---

## Research Report

Detailed reports describing dataset construction, model development, evaluation methodology, trust considerations, and explainability analysis are included in https://github.com/kmarren/WomensBasketball-csce581Spring2026.git and https://github.com/kmarren/Womens-Basketball-Machine-Learning-Models.git. One project was done for a Math Foundations of Machine Learning course, and one was done for Trustworthy Artificial Intelligence course. 

Key topics covered:

- Data engineering challenges
- Data leakage mitigation
- Model comparison
- Trustworthiness considerations
- SHAP analysis
- LIME analysis
- Future research directions

---

## Running Locally

### Clone Repository
git clone https://github.com/kmarren/wcast.git

cd wcast

### Backend Setup
cd backend

cd game_predictions

python3 manage.py runserver 127.0.0.1:8000

### Frontend Setup
cd frontend

npm install

npm run dev
