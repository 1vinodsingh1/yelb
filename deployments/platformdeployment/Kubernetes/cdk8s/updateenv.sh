export NEWPOSTGRESENDPOINT=tenantdb2.cluster-cha8bjtv3zkg.us-west-2.rds.amazonaws.com
envsubst < dist/yelb-cdk8sv2.k8s.yaml  | kubectl apply -f - --namespace=tenant-2
