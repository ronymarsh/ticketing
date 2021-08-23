import buildClient from '../api/build-client';

const Landing = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// Specific to nextJS: if we decide to implement this, nextJS is going to call this function while it is attempting to render our app
// a good oppertunity to fetch any data that this component may need during the server side rendering process
// getInitialProps is NOT a react component. can't use hooks inside the function

// because we are running a k8s cluster through Ingerss Nginx that forwards requests to different services that are running inside the cluster,
// the relative path we are providing will be attached to localhost. since this function is running inside our computer and not inside the browser, the axios request will attach localhost:80
// as the URL prefix.
// BUT the client is running in some *container* and does not have any functionality to handle incoming requests(specifically requests coming to localhost:80),
// as opposed to Ingress (also running in some container) where we *configured* forwarding requests coming to localhost:80 depending on the path provided. see infra/k8s/ingress-srv.yaml

// URL format to send requests from inside the cluster to a cluster that is in a different namespace:
// http://NAMEOFSERVICE.NAMESPACE.svc.cluster.local
// exampe: http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
// can use External Name Service to replace nasty URL to a more convenient one.
// how to see services not from namespace 'default': kubectl get services -n <namespace>
// how to see all namespaces in the cluster: kubectl get namespace

Landing.getInitialProps = async (context) => {
  console.log('LANDING PAGE');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default Landing;
