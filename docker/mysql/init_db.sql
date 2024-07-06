-- Create databases
CREATE DATABASE IF NOT EXISTS llm_server;
CREATE DATABASE IF NOT EXISTS n8n;

-- Create users and grant privileges
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON llm_server.* TO 'admin'@'%';
GRANT ALL PRIVILEGES ON n8n.* TO 'admin'@'%';

FLUSH PRIVILEGES;