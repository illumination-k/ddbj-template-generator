import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type FormData = {
  bioproject_id: string;
};

export default function useBioprojectForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();

  return {
    registerProps: register("bioproject_id", { required: true }),
    onSubmit: handleSubmit((data) => router.push(`/${data.bioproject_id}/biosample`)),
  };
}
