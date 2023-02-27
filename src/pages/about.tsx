import Nav from "@/client/components/Nav";
import { H2 } from "@/client/components/Typography";
import { NextPage } from "next";

const AboutPage: NextPage = ({}) => {
  return (
    <>
      <Nav />
      <div>
        <h1>About</h1>
        <H2>Purpose of this project</H2>
        <H2>Related Projects</H2>
        <H2>
          Contact us
        </H2>
        <p>
          When you have request for this project or find bugs, feel free to create an issue or a PR in github, or email
          to
        </p>
      </div>
    </>
  );
};

export default AboutPage;
