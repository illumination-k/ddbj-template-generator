import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Button } from "./Button";

export type PreviewTsvProps = {
  bioproject_id: string;
  tsvGenerator: () => string;
};

const PreviewTsv = ({ tsvGenerator, bioproject_id }: PreviewTsvProps) => {
  const [open, setOpen] = useState(false);
  const [tsv, setTsv] = useState("");
  const toggle = () => setOpen(!open);

  return (
    <>
      <div>
        <Button
          onClick={() => {
            setTsv(tsvGenerator());
            toggle();
          }}
        >
          Preview
        </Button>
      </div>

      <Dialog as="div" className={"relative z-20"} onClose={toggle} open={open}>
        <div className="fixed inset-3 overflow-y-auto">
          <Dialog.Panel className="w-full h-full transform rounded-2xl bg-gray-100 transition-all">
            <Dialog.Title className="mx-10 mb-3 text-center text-4xl font-semibold">
              Preview {bioproject_id} Submission
            </Dialog.Title>
            <div className="mx-5 px-2 h-5/6 rounded-lg bg-white whitespace-pre overflow-x-scroll overflow-y-scroll">
              {tsv}
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  const file = new Blob([tsv], { type: "text/plain" });
                  const element = document.createElement("a");
                  element.href = URL.createObjectURL(file);
                  element.download = `${bioproject_id}.tsv`;

                  document.body.appendChild(element);
                  element.click();
                }}
              >
                Download
              </Button>
              <Button color="danger" onClick={toggle}>Close</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default PreviewTsv;
