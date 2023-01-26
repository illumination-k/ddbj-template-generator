import { Button } from "@/client/components/Button";
import Input from "@/client/components/FieldForm/Input";
import LabelWithHelp from "@/client/components/FieldForm/LabelWithHelp";
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
      <h1>DDBJ Template Generator</h1>
      <h2>Biosample</h2>
      <form
        onSubmit={handleSubmit((data) => {
          router.push(`/1480154/${data.bioproject_id}/biosample`);
        })}
      >
        <LabelWithHelp label="Bioproject ID">
          <Input {...register("bioproject_id", { required: true })} />
        </LabelWithHelp>
        <Button type="submit">Start Generation</Button>
      </form>
    </div>
  );
};

export default Home;
