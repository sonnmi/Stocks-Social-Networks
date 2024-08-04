import pandas as pd
import psycopg2

# Read the CSV file
csv_file_path = '/home/yesom/project/data/SP500History.csv'
df = pd.read_csv(csv_file_path)

# Database connection parameters
db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

# Establish the database connection
conn = psycopg2.connect(**db_params)
cur = conn.cursor()

# Create the table if it doesn't exist
create_table_query = """
CREATE TABLE IF NOT EXISTS StockHistory (
    date DATE,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    symbol VARCHAR(5),
    volume INT
);
"""

cur.execute(create_table_query)
conn.commit()
# Insert data into the table
print(df.head())
print(df.columns)
df.rename(columns={'Code': 'stockcode'}, inplace=True)
# Insert data into the table
for index, row in df.iterrows():
    insert_query = """
        INSERT INTO StockHistory("date", "open", "high", "low", "close", "symbol", "volume")
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, (
        row['Timestamp'],
        row['Open'],
        row['High'],
        row['Low'],
        row['Close'],
        row['stockcode'],
        row['Volume']
    ))

# Commit the transaction and close the connection
conn.commit()
cur.close()
conn.close()

print("Data imported successfully")