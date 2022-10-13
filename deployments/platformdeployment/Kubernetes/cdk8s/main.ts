import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { KubeDeployment, KubeService, IntOrString } from './imports/k8s';

export class YelbCdk8s extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const yelbuilabel = { app: 'yelb-ui-deployment' };
    const yelbappserverlabel = { app: 'yelb-appserver-deployment' };
    const redisserverlabel = { app: 'redis-server-deployment' };

    // -------------------------------------------------------------------- //

    new KubeService(this, 'yelb-ui', {
      metadata: { name: "yelb-ui"},
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(80) } ],
        selector: yelbuilabel,
      }
    });

    new KubeDeployment(this, 'yelb-ui-deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: yelbuilabel
        },
        template: {
          metadata: { labels: yelbuilabel  },
          spec: {
            containers: [
              {
                name: 'yelb-ui-container',
                image: 'mreferre/yelb-ui:0.8',
                ports: [ { containerPort: 80 } ]
              }
            ]
          }
        }
      }
    });
    // -------------------------------------------------------------------- //

    // -------------------------------------------------------------------- //

    new KubeService(this, 'yelb-appserver', {
      metadata: { name: "yelb-appserver"},
      spec: {
        type: 'ClusterIP',
        ports: [ { port: 4567, targetPort: IntOrString.fromNumber(4567) } ],
        selector: yelbappserverlabel
      }
    });

    new KubeDeployment(this, 'yelb-appserver-deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: yelbappserverlabel
        },
        template: {
          metadata: { labels: yelbappserverlabel  },
          spec: {
            containers: [
              {
                name: 'yelb-appserver',
                image: 'vinodkum001/yelbappserver:1'
              }
            ]
          }
        }
      }
    });

    // -------------------------------------------------------------------- //



    new KubeService(this, 'redis-server', {
      metadata: { name: "redis-server"},
      spec: {
        type: 'ClusterIP',
        ports: [ { port: 6379, targetPort: IntOrString.fromNumber(6379) } ],
        selector: redisserverlabel,
      }
    });

    new KubeDeployment(this, 'redis-server-deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: redisserverlabel
        },
        template: {
          metadata: { labels: redisserverlabel  },
          spec: {
            containers: [
              {
                name: 'redis-server',
                image: 'redis:4.0.2'
              }
            ]
          }
        }
      }
    });


    // -------------------------------------------------------------------- //



  }
}

const app = new App();
new YelbCdk8s(app, 'yelb-cdk8sv2');
app.synth();
