# Install using Helm

## Add helm repo

`helm repo add grafana https://grafana.github.io/helm-charts`

## Update helm repo

`helm repo update`

## Install helm 

`helm install grafana-server grafana/grafana`

## Expose Grafana Service

`kubectl expose service grafana-server --type=NodePort --target-port=3000 --name=grafana-server-ext`
