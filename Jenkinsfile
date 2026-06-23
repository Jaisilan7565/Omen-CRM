pipeline {
    agent any

    environment {
        // Define default settings, which can be overridden in Jenkins pipeline configuration
        // By default, Nginx proxies requests under /api to the backend container,
        // making the build completely environment-agnostic.
        VITE_API_URL = '/api/v1'
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
                echo "VITE_API_URL set to: ${env.VITE_API_URL}"
                
                // Spin up database, backend, and frontend containers using docker compose
                sh """
                    export VITE_API_URL="${env.VITE_API_URL}"
                    export DB_NAME="${env.DB_NAME}"
                    export DB_USER="${env.DB_USER}"
                    export DB_PASSWORD="${env.DB_PASSWORD}"
                    export JWT_SECRET="${env.JWT_SECRET}"
                    
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
