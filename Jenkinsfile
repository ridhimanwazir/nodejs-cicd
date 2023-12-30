pipeline {
    agent any
    tools {
        jdk 'jdk17'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }
    stages {
        stage('clean workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout From Git') {
            steps {
                git branch: 'main', url: 'https://github.com/ridhimanwazir/nodejs-cicd.git'
            }
        }
        stage("Sonarqube Analysis ") {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=nodejs-app \
                        -Dsonar.projectKey=nodejs-app '''
                }
            }
        }
        stage("TRIVY File scan") {
            steps {
                sh "trivy fs . > trivy-fs_report.txt"
            }
        }
        stage("OWASP Dependency Check") {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --format XML ', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('Deploy image to docker hub') {
            steps {
                dir('Ansible') {
                    script {
                            ansiblePlaybook credentialsId: 'ssh', disableHostKeyChecking: true, installation: 'ansible', inventory: '/etc/ansible/', playbook: 'docker.yaml'
                   }
                }
            }
        }
        stage("TRIVY docker image scan") {
            steps {
                sh "trivy image ridhimanwazir/python-webapp:latest > trivy.txt"
            }
        }
        stage('k8 deployment using ansible') {
            steps {
                dir('Ansible') {
                    script {
                ansiblePlaybook credentialsId: 'ssh', disableHostKeyChecking: true, installation: 'ansible', inventory: '/etc/ansible/', playbook: 'k8s.yaml'
                    }
                }
            }
        }
    }
}
