import mysql from "mysql2/promise";

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "password",
  database: process.env.MYSQL_DATABASE || "ats_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to execute queries
export async function executeQuery<T>(
  query: string,
  params?: any[]
): Promise<T> {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "password",
    database: process.env.MYSQL_DATABASE || "ats_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create candidates table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS candidates (
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        mobile VARCHAR(20) NOT NULL,
        gender ENUM('Male', 'Female', 'Other'),
        dateOfBirth DATE,
        fathersName VARCHAR(255),
        age INT,
        address TEXT,
        hiringProgram VARCHAR(255),
        secondaryNumber VARCHAR(20),
        industry VARCHAR(255),
        functionalArea VARCHAR(255),
        currentOrganization VARCHAR(255),
        currentDesignation VARCHAR(255),
        preferredLocation VARCHAR(255),
        currentLocation VARCHAR(255),
        nationality VARCHAR(100),
        noticePeriod VARCHAR(100),
        relocate BOOLEAN,
        lookingForRemoteWork BOOLEAN,
        maritalStatus ENUM('Single', 'Married', 'Divorced', 'Widowed'),
        primarySource VARCHAR(255),
        secondarySource VARCHAR(255),
        skills JSON,
        language JSON,
        certificates JSON,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        department VARCHAR(255),
        location VARCHAR(255),
        employmentType VARCHAR(255),
        salaryMin INT,
        salaryMax INT,
        skillsRequired JSON,
        postedDate DATETIME,
        closingDate DATETIME,
        status VARCHAR(255),
        candidateIds JSON,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

    `);

    // Create sync queue table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INT AUTO_INCREMENT PRIMARY KEY,
        operation ENUM('insert', 'update', 'delete') NOT NULL,
        entityType ENUM('candidate', 'job', 'application') NOT NULL,
        entityId VARCHAR(36) NOT NULL,
        status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        details TEXT,
        INDEX idx_status (status),
        INDEX idx_entity (entityType, entityId)
      )
    `);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database tables:", error);
    throw error;
  }
}

export default pool;
