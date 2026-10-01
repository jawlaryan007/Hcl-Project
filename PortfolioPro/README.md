# PortfolioPro – Stock Trading & Portfolio Management System 📈
> **3rd Year Computer Engineering Project**  
> Full-Stack Paper Trading & Portfolio Tracking Web Application

PortfolioPro is a realistic, professional paper-trading stock portfolio management web application built for college project demonstration. It allows users to register, explore Indian stock market equities (in ₹ INR), simulate buy and sell trades using a starting virtual cash balance of **₹1,00,000**, track real-time portfolio profit and loss (P&L), maintain a watchlist, view complete transaction ledgers, and manage stocks via an Admin Portal.

---

## 🛠️ Technology Stack

- **Frontend:** Angular 18, TypeScript, HTML5, Vanilla CSS, Angular Router, Angular HttpClient
- **Backend:** Java 17+, Spring Boot 3.2, Spring Data JPA / Hibernate, Spring Security (JWT)
- **Database:** PostgreSQL (pgAdmin GUI compatible) + Dual H2 Fallback
- **Currency:** Indian Rupee (₹ INR)
- **Architecture:** Layered Architecture (Controller ➔ Service ➔ Repository ➔ Entity ➔ DTO)

---

## 🐘 Step 1: PostgreSQL & pgAdmin Database Setup

### 1. Open pgAdmin & Create Database
1. Open **pgAdmin 4** on your machine.
2. Connect to your local PostgreSQL server instance.
3. Right-click on **Databases** ➔ **Create** ➔ **Database...**
4. Enter Database Name: **`portfoliopro_db`** and click **Save**.

### 2. Run the SQL Script
1. Select `portfoliopro_db` in pgAdmin, click **Tools** in the top menu, and select **Query Tool**.
2. Open or copy the contents of [`database/pgadmin_setup.sql`](file:///c:/Users/Nikhil.Jawla/Desktop/PortfolioPro/database/pgadmin_setup.sql).
3. Click the **Execute/Run (F5)** button.

This script creates the following relational tables:
- `users` (id, name, email, password, role, virtual_balance)
- `stocks` (id, symbol, company_name, sector, current_price, previous_price)
- `holdings` (id, user_id, stock_id, quantity, average_price)
- `transactions` (id, user_id, stock_id, type, quantity, price, total_amount, transaction_date, status)
- `watchlist` (id, user_id, stock_id)

And seeds demo Indian stocks (Reliance, TCS, Infosys, HDFC Bank, ICICI Bank, ITC, SBI, Tata Motors, Bharti Airtel, L&T, Wipro, Axis Bank).

---

## 🚀 Step 2: Running the Spring Boot Backend

1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Verify PostgreSQL credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/portfoliopro_db
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend REST API will start on **`http://localhost:8080`**.*

---

## 🅰️ Step 3: Running the Angular Frontend

1. Navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Start the Angular dev server:
   ```bash
   npm start
   ```
3. Open your browser and go to: **`http://localhost:4200`**

---

## 🔑 Demo User Credentials (1-Click Login Available)

For easy demonstration during your college presentation, 1-click login buttons are provided on the login page:

| Role | Email | Password | Starting Virtual Balance |
| :--- | :--- | :--- | :--- |
| **Student (USER)** | `student@portfoliopro.com` | `student123` | ₹1,00,000.00 |
| **Admin (ADMIN)** | `admin@portfoliopro.com` | `admin123` | ₹10,00,000.00 |

---

## 🌐 REST API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new paper trading account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Fetch active user profile and balance |
| `GET` | `/api/stocks` | List & search available Indian stocks |
| `GET` | `/api/stocks/{id}` | Get stock details and daily price change |
| `POST` | `/api/trading/buy` | Buy stock (deducts virtual balance, updates holding & transaction) |
| `POST` | `/api/trading/sell` | Sell stock (adds revenue to balance, updates holding & transaction) |
| `GET` | `/api/portfolio` | Get overall portfolio summary & live P&L |
| `GET` | `/api/transactions` | Get user order transaction ledger |
| `GET` | `/api/watchlist` | Get user watchlist items |
| `POST` | `/api/watchlist/{stockId}` | Add stock to watchlist |
| `DELETE` | `/api/watchlist/{stockId}` | Remove stock from watchlist |
| `GET` | `/api/admin/stats` | Admin platform metrics |
| `POST` | `/api/stocks` | Admin: Add new stock |
| `PUT` | `/api/stocks/{id}` | Admin: Update stock price |
| `DELETE` | `/api/stocks/{id}` | Admin: Delete stock |

---

## 🔮 Future Enhancements (For Viva Presentation)

1. Integration with Live National Stock Exchange (NSE) WebSockets / REST API.
2. Real broker integration for live trading.
3. Mobile app built with Flutter / React Native.
4. AI-driven sentiment analysis on stock market news.
5. Advanced technical indicators (MACD, RSI, Bollinger Bands).

---

*Built with Java, Spring Boot, Angular, PostgreSQL and Spring Data JPA.*
