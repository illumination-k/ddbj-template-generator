import { Button } from "@/client/components/Button";
import Input from "@/client/components/Form/Input";
import Nav from "@/client/components/Nav";
import { H2 } from "@/client/components/Typography";
import useBioprojectForm from "@/client/hooks/useBioprojectForm";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const { registerProps, onSubmit } = useBioprojectForm();
  return (
    <>
      <Nav />
      <div className="grid grid-cols-1 place-items-center">
        <div className="w-8/12">
          <H2 className="text-center">
            What is this tool?
          </H2>
          <p className="text-center text-xl text-gray-500">
            This tool can generate Biosample submission TSV for expression analysis with well-defined schema in each
            species. This tool helps you to easily create Biosample submission TSV without wondering what information to
            enter.
          </p>
          <H2 className="text-center">
            Usage
          </H2>

          <div className="text-center">
            <ol className="text-left inline-block space-y-1 text-gray-500 list-decimal list-inside">
              {[
                "Enter your Bioproject ID into the following form",
                "Fill out the forms and register your sample data",
                "Repeat while all of your sample data are successfully registered",
                "Click preview and check generated TSV, and download Biosample submission TSV",
              ].map(
                (s, i) => (
                  <li key={i}>
                    <span className="text-xl text-gray-500">
                      {s}
                    </span>
                  </li>
                ),
              )}
            </ol>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 place-items-center mt-10">
          <label className="text-2xl">Bioproject ID</label>
          <Input {...registerProps} />
          <Button className="my-2" type="submit">Start Generation</Button>
        </form>
      </div>
    </>
  );
};

export default Home;
