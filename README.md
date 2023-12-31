# nodejs-app

Deploying nodejs app on Kubernetes using CI/CD with Jenkins in `Ubuntu`

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://www.gnu.org/software/bash/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/gnu_bash/gnu_bash-icon.svg" alt="bash" width="40" height="40"/> </a> <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://cloud.google.com" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg" alt="gcp" width="40" height="40"/> </a> <a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/> </a> <a href="https://grafana.com" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/grafana/grafana-icon.svg" alt="grafana" width="40" height="40"/> </a> <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://www.java.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" alt="java" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://www.jenkins.io" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/jenkins/jenkins-icon.svg" alt="jenkins" width="40" height="40"/> </a> <a href="https://kubernetes.io" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg" alt="kubernetes" width="40" height="40"/> </a> <a href="https://www.linux.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" alt="linux" width="40" height="40"/> </a> <a href="https://www.nginx.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nginx/nginx-original.svg" alt="nginx" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> </p>


### End-to-end demonstration video available on: [Loom](https://www.loom.com/share/86873c74606a4edb9b4e40da6d91280a)

### Architecture


![image](https://github.com/ridhimanwazir/nodejs-cicd/assets/46512771/0e03a60f-d6f1-4e92-b5ef-a5833efc4746)


## Step 1 - Setup GCP free account and Compute Engines

- Set up one GCP compute engine with the below-mentioned tools except for Kubernetes.
- Create one compute engine for the Kubernetes master and another for the Kubernetes worker.
- create one loadbalancer to redirect traffic so as to avoid using nodePort
- Kubectl Setup on CE running Jenkins
  ```
  sudo apt update
  sudo apt install curl
  curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  kubectl version --client

- Master and Worker node setup
  ```
  sudo apt-get update 
  sudo apt-get install -y docker.io
  sudo usermod –aG docker Ubuntu
  newgrp docker
  sudo chmod 777 /var/run/docker.sock
  sudo curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
  sudo tee /etc/apt/sources.list.d/kubernetes.list <<EOF
  deb https://apt.kubernetes.io/ kubernetes-xenial main
  EOF
  sudo apt-get update
  sudo apt-get install -y kubelet kubeadm kubectl
  sudo snap install kube-apiserver
  ```
- Master Only setup
  ```
  sudo kubeadm init --pod-network-cidr=10.244.0.0/16
  # in case your in root exit from it and run below commands
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

- Worker node only setup
  ```
  sudo kubeadm join <master-node-ip>:<master-node-port> --token <token> --discovery-token-ca-cert-hash <hash>
  

## Step 2 — Install Java, Jenkins, Docker, Trivy, minikube, Ansible, and helm

[Java](https://www.rosehosting.com/blog/how-to-install-java-17-lts-on-ubuntu-20-04/)

[Jenkins](https://www.jenkins.io/doc/book/installing/linux/)

[Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)

[Trivy](https://aquasecurity.github.io/trivy/v0.18.3/installation/)

[miniKube](https://minikube.sigs.k8s.io/docs/tutorials/wsl_docker_driver/)

[Helm](https://helm.sh/docs/intro/install/)

[Ansible](https://docs.ansible.com/ansible/latest/installation_guide/installation_distros.html)

## Step 3 - SonarQube Server

### Use docker to start a Sonarqube Server which will be accessible on `external IP:9000`
`docker run -d --name sonar -p 9000:9000 sonarqube:lts-community`

## Jenkins Setup

- Install Jenkins Plugins like JDK, Sonarqube Scanner, Ansible, OWASP Dependency Check, Docker, and Kubernetes
- Enable jdk17, SonarScanner, Docker, and Ansible in Jenkins tools
- Configure sonarQube in the Jenkins system

## Step 4 - Setup Ansible Repository in Ubuntu

- Create an Inventory file in Ansible
  ```
  cd /etc/ansible
  sudo vi hosts
  
- Add the IP where Jenkins is installed this will allow Ansible to run the setup for docker and minikube using the Playbooks
  ```
  [k8s] #any name you want
  external IP of Jenkins vm
  external IP of Kubernetes master vm
- verify that the host is reachable
  ```
  ansible -m ping all

## Step 5 - Create Jenkins Pipeline using the Jenkinsfile available in this repo and add a build trigger to poll Git so that the pipeline can run whenever a new change is deployed

- once the pipeline has run there will be a docker image with the specified tags registered to the docker registry and a docker container will be running which can be used to access the application on   
  `external IP:5000`
- There will be a k8s deployment, service, and ingress available( the service should be accessible on `load balancer IP`
- To use ingress we also need to setup nginx ingress controller which will automatically detect ingress resources and direct the traffic to the specified host 
- The ingress will have a domain assigned `sampleapp.local` which is mapped to the load balancer IP
  `Curl -L http:\\sampleapp.local` will return the HTML page

## Step 6 - Monitoring and Logging using Prometheus and Grafana

- Setup Prometheus and Grafana using the below link

  [Prometheus-Grafana](https://docs.ansible.com/ansible/latest/installation_guide/installation_distros.html)
  
  Prometheus - `external IP:nodePort`
  
  Grafana - `external IP:nodePort`
  
- our nodejs application is using promql to send metrics and these metrics are available at `load balancer IP/metrics`
- Add Prometheus as the default data source in Grafana and update prometheus.yml to add a new job which will scrap the application metrics
  ```
  scrape_configs:
  - job_name: 'your_job_name'
    static_configs:
      - targets: ['35.208.72.203:4000']
  ```
  verify in targets to validate if Prometheus is scrapping the metrics.
- Create a grafana dashboard to monitor all the scrapped metrics.
  
