# Python-webapp
Deploying Python webapp on miniKube using CI/CD with Jenkins in `Ubuntu`

End-to-end demonstration video available on; [Loom](https://www.loom.com/share/86873c74606a4edb9b4e40da6d91280a)

## Step 1 — Install Java, Jenkins, Docker, Trivy, minikube, Ansible, and helm

[Java](https://www.rosehosting.com/blog/how-to-install-java-17-lts-on-ubuntu-20-04/)

[Jenkins](https://www.jenkins.io/doc/book/installing/linux/)

[Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)

[Trivy](https://aquasecurity.github.io/trivy/v0.18.3/installation/)

[miniKube](https://minikube.sigs.k8s.io/docs/tutorials/wsl_docker_driver/)

[Helm](https://helm.sh/docs/intro/install/)

[Ansible](https://docs.ansible.com/ansible/latest/installation_guide/installation_distros.html)

## Step 2 - SonarQube Server

### Use docker to start a Sonarqube Server which will be accessible on `ip:9000`
`docker run -d --name sonar -p 9000:9000 sonarqube:lts-community`

## Jenkins Setup

- Install Jenkins Plugins like JDK, Sonarqube Scanner, Ansible, OWASP Dependency Check, Docker, and Kubernetes
- Enable jdk17, SonarScanner, Docker, and Ansible in Jenkins tools
- Configure sonarQube in the Jenkins system

## Step 3 - Setup Ansible Repository in Ubuntu

- Create an Inventory file in Ansible
  ```
  cd /etc/ansible
  sudo vi hosts
  
- Add the IP where Jenkins is installed this will allow Ansible to run the setup for docker and minikube using the Playbooks
  ```
  [local]#any name you want
  localhost
- verify that the host is reachable
  ```
  ansible -m ping all

## Step 4 - Create Jenkins Pipeline using the Jenkinsfile available in this repo and add a build trigger to poll Git so that the pipeline can run whenever a new change is deployed

- once the pipeline has run there will be a docker image with the specified tags registered to the docker registry and a docker container will be running which can be used to access the application on   
  `localhost:5000`
- There will be a minikube deployment, service, and ingress available( the service should be accessible on `minikubeIP:nodePort`
- The ingress will have a domain assigned webapp.local which is mapped to minikubeIP
  `Curl -L http:\\webapp.local` will return the html page

## Step 5 - Monitoring and Logging using Prometheus and Grafana

- Setup Prometheus and Grafana using the specific readme available in the respective folder in this repo `prometheus_setup/helm.md` && `grafana_setup/helm.md`,
  which will start Prometheus and Grafana service in   
  miniKube.
  
  Prometheus - `minikubeIP:9090`
  
  Grafana - `minikubeIP:3000`
- since we used helm for the setup Prometheus will by default scrap all available minikube metrics which can also be verified in `minikubeIP:9090/targets`
- Add Prometheus as the default data source in Grafana and create a dashboard using one of the readily available ones on grafana with sufficient metrics required to set up monitoring.
