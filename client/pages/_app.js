import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

// Page component getInitialProps: context === {req,res}
// Custom App component getInitialProps: context === {Component, ctx:{req,res}}

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

// information fetching that is common for all of the different pages
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
