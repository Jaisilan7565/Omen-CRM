pipeline {
    agent any

    environment {
        // Default deployment configuration targeting your VPS
        VPS_PUBLIC_IP = '72.61.236.52'
        FRONTEND_PORT = '3080'
        FRONTEND_URL = "http://${env.VPS_PUBLIC_IP}:3080"
        BACKEND_PORT = '5002'
        VITE_API_URL = "http://${env.VPS_PUBLIC_IP}:5002/api/v1"
        APP_BASE_URL = "http://${env.VPS_PUBLIC_IP}:5002"
        DB_PORT = '35432'
        DB_NAME = 'crm_db'
        DB_USER = 'postgres'
        DB_PASSWORD = 'jayking46'
        JWT_SECRET = 'super_secret_crm_jwt_key_2026'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy') {
            steps {
                echo "Deploying Zoho CRM 2 to VPS..."
                echo "Creating production .env file dynamically..."
                
                // Write environment variables into the .env file in the workspace
                sh """
                    echo "VPS_PUBLIC_IP=${env.VPS_PUBLIC_IP}" > .env
                    echo "FRONTEND_PORT=${env.FRONTEND_PORT}" >> .env
                    echo "FRONTEND_URL=${env.FRONTEND_URL}" >> .env
                    echo "BACKEND_PORT=${env.BACKEND_PORT}" >> .env
                    echo "VITE_API_URL=${env.VITE_API_URL}" >> .env
                    echo "APP_BASE_URL=${env.APP_BASE_URL}" >> .env
                    echo "DB_PORT=${env.DB_PORT}" >> .env
                    echo "DB_NAME=${env.DB_NAME}" >> .env
                    echo "DB_USER=${env.DB_USER}" >> .env
                    echo "DB_PASSWORD=${env.DB_PASSWORD}" >> .env
                    echo "JWT_SECRET=${env.JWT_SECRET}" >> .env
                    
                    docker compose down --remove-orphans
                    docker compose up -d --build
                """
            }
        }

        stage('Verification') {
            steps {
                echo "Verifying active containers..."
                sh """
                    sleep 10
                    docker ps | grep zoho_crm
                """
            }
        }

        stage('Prune Images') {
            steps {
                echo "Cleaning up unused dangling images..."
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "Zoho CRM successfully deployed on VPS port 3080!"
        }
        failure {
            echo "Deployment failed! Check the Jenkins console log."
        }
    }
}
