import PbrSEO from "../components/PbrSeo";

function Home() {
  return (
    <>
      <PbrSEO
        title='Pascal | Home'
        description='Portfolio site, using React'
        canonical='/'   // TODO: add the https site here
        addFacebookTag={true}
      />
      <h2> Home page</h2>
      <h3> In progress...</h3>
    </>
  );
}

export default Home
