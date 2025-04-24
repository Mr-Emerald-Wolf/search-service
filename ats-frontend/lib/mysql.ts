import mysql from "mysql2"

// MySQL connection configuration
export interface MySQLConfig {
  host: string
  user: string
  password: string
  database: string
  waitForConnections: boolean
  connectionLimit: number
  queueLimit: number
}

// Create a connection pool with proper configuration
const config: MySQLConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "password",
  database: process.env.MYSQL_DATABASE || "ats_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const pool = mysql.createPool(config).promise()

/**
 * Execute a MySQL query with proper error handling
 */
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute(query, params)
    return rows as T
  } catch (error) {
    console.error("MySQL query error:", error)
    throw new Error(`Database error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Get a direct connection from the pool
 * Useful for transactions
 */
export async function getConnection() {
  try {
    return await pool.getConnection()
  } catch (error) {
    console.error("MySQL connection error:", error)
    throw new Error(`Database connection error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Initialize database tables if they don't exist
 */
export async function initializeDatabase() {
  const connection = await pool.getConnection()

  try {
    // Create queue_events table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS queue_events (
        id VARCHAR(36) PRIMARY KEY,
        operation ENUM('insert', 'update', 'delete') NOT NULL,
        entity_type ENUM('candidate', 'job', 'application') NOT NULL,
        entity_id VARCHAR(36) NOT NULL,
        status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL,
        timestamp DATETIME NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create candidates table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        gender ENUM('Male', 'Female', 'Other'),
        date_of_birth DATE,
        fathers_name VARCHAR(255),
        age INT,
        address TEXT,
        hiring_program VARCHAR(255),
        secondary_number VARCHAR(20),
        industry VARCHAR(255),
        functional_area VARCHAR(255),
        current_organization VARCHAR(255),
        current_designation VARCHAR(255),
        preferred_location VARCHAR(255),
        current_location VARCHAR(255),
        nationality VARCHAR(255),
        notice_period VARCHAR(50),
        relocate BOOLEAN DEFAULT FALSE,
        looking_for_remote_work BOOLEAN DEFAULT FALSE,
        marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed'),
        primary_source VARCHAR(255),
        secondary_source VARCHAR(255),
        skills JSON,
        language JSON,
        certificates JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create jobs table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        department VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        employment_type VARCHAR(255) NOT NULL,
        salary_min INT NOT NULL,
        salary_max INT NOT NULL,
        skills_required JSON NOT NULL,
        posted_date DATE NOT NULL,
        closing_date DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        candidate_ids JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create applications table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(36) PRIMARY KEY,
        candidate_id VARCHAR(36) NOT NULL,
        job_id VARCHAR(36) NOT NULL,
        status VARCHAR(50) DEFAULT 'Applied',
        applied_date DATE NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      )
    `)
  } finally {
    connection.release()
  }
}

export default pool