import Nav from "@/client/components/Nav";
import { H2 } from "@/client/components/Typography";
import { NextPage } from "next";

const AboutPage: NextPage = ({}) => {
  return (
    <>
      <Nav />
      <div className="grid grid-cols-5">
        <div></div>
        <div className="col-span-3">
          <H2>Purpose of this project</H2>
          <p>
            The purpose of this project is to provide appropriate schemas for Biosample data on a method and species
            basis, as well as generate TSV files for submission that reflect input results based on those schemas, for
            registration in NCBI/DDBJ.
          </p>
          <H2>Simplify data collection and analysis</H2>
          <p>
            Schemas for each species are defined in JSON format on GitHub and new schemas can be defined via Pull
            Requests. This project is expected to simplify text mining and the construction of secondary databases based
            on species and method.
          </p>
          <H2>
            Contact us
          </H2>
          <p>
            If you have any inquiries about this project, please create an Issue on GitHub or contact us at A@B.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
