from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yfinance as yf
import psycopg2
import numpy as np
from psycopg2.extensions import register_adapter, AsIs
register_adapter(np.int64, AsIs)
from datetime import datetime, timedelta

app = FastAPI()

db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'postgres',
    'host': '127.0.0.1',
    'port': '5432'
}


search_query = """
SELECT symbol FROM stock;
"""

check_query = """
SELECT EXISTS (
    SELECT symbol
    FROM stock
    WHERE symbol = %s
);
"""

insert_query = """
            INSERT INTO stockhistory("date", "open", "high", "low", "close", "symbol", "volume")
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (date, symbol) DO NOTHING;
        """

# Allow CORS
origins = [
    "http://localhost:3000",  # Your frontend app
    "http://127.0.0.1:3000",  # Alternative local address
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

conn = psycopg2.connect(**db_params)
cur = conn.cursor()


def get_stock_time_period(stock_codes, start_date, end_date):
    pull_data(stock_codes, start_date, end_date)

def pull_data(stock_codes, start_date, end_date):
    for stock_code in stock_codes:
        stock_data = yf.Ticker(stock_code)
        data = stock_data.history(start=start_date, end=end_date)

        if data.empty:
            continue

        for index, row in data.iterrows():

            cur.execute(insert_query, (
                index,
                float(row['Open']),
                float(row['High']),
                float(row['Low']),
                float(row['Close']),
                stock_code,
                float(row['Volume'])
            ))
    conn.commit()


class Stock(BaseModel):
    stockcode: str
    start_date: str
    end_date: str

@app.post("/stock/")
async def create_stock(stock: Stock):
    stock_code = stock.stockcode
    start_date = stock.start_date
    end_date = stock.end_date
    get_stock_time_period([stock_code], start_date, end_date)
    return {"stockcode": stock_code, "start_date": start_date, "end_date": end_date}

@app.post("/stock/{stock_code}/{days}")
async def read_stock(stock_code, days: int):
    cur.execute(check_query, (stock_code,))
    result = cur.fetchone()
    if not result[0]:
        raise HTTPException(status_code=404, detail="Stock not found")
    start_date = datetime.now() - timedelta(days=days)
    end_date = datetime.now()
    print(stock_code, start_date, end_date)
    get_stock_time_period([stock_code], start_date, end_date)
    return {"stockcode": stock_code, "start_date": start_date, "end_date": end_date}

@app.post("/stocks/updateAll/{days}")
async def update_all_stocks(days: int):
    cur.execute(search_query)
    result = cur.fetchall()
    stock_codes = [stock[0] for stock in result]
    start_date = datetime.now() - timedelta(days=days)
    end_date = datetime.now()
    get_stock_time_period(stock_codes, start_date, end_date)
    print(stock_codes, start_date, end_date)
    return {"start_date": start_date, "end_date": end_date}