import { Button } from "@/client/components/Button";
import Input from "@/client/components/FieldForm/Input";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type FormData = {
  bioproject_id: string;
};

const Home: NextPage = () => {
  const { handleSubmit, register } = useForm<FormData>();
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 place-items-center">
      <div className="w-8/12">
        <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-4">
          Biosample Generator (Beta)
        </h1>
        <h2 className="text-center text-3xl font-bold mt-1 mb-3 text-gray-800 border-b-1 border-color-gray-100">
          What is this tool?
        </h2>
        <p className="text-center text-xl text-gray-500">
          This tool can generate Biosample submission TSV with well-defined schema in each species for expression
          analysis. This tool helps you to easily create Biosample submission TSV without wondering what information to
          enter.
        </p>
        <h2 className="text-center text-3xl font-bold mt-1 mb-3 text-gray-800 border-b-1 border-color-gray-100">
          Usage
        </h2>

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

      <form
        onSubmit={handleSubmit((data) => {
          router.push(`/1480154/${data.bioproject_id}/biosample`);
        })}
      >
        <div className="grid grid-cols-1 place-items-center mt-10">
          <label className="text-3xl font-bold my-2">Bioproject ID</label>
          <Input {...register("bioproject_id", { required: true })} />
          <Button className="my-2" type="submit">Start Generation</Button>
        </div>
      </form>
    </div>
  );
};

export default Home;
