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
                git branch: 'main', url: 'https://github.com/ridhimanwazir/python-webapp-cicd.git'
            }
        }
        stage("Sonarqube Analysis ") {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=Python-Webapp \
                        -Dsonar.projectKey=Python-Webapp '''
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
                            def ansibleCommand = """
                                ansible-playbook -i /etc/ansible/hosts docker.yaml -vvv
                            """
                            sh(ansibleCommand)
                   }
                }
            }
        }
        stage("TRIVY docker image scan") {
            steps {
                sh "trivy image ridhimanwazir/python-webapp:latest > trivy.txt"
            }
        }
        
    }
}
