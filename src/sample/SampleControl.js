import { Control } from "../modules/control";

const options = [
  { label: "a", value: "a" },
  { label: "b", value: "b" },
];

export const SampleControl = () => {
  return (
    <div>
      <Control type="text" />
      <Control type="number" />
      <Control type="textarea" />
      <Control type="select" options={options} />
      <Control type="radio" options={options} />
      <Control type="checkbox" options={options} />
      <Control />
    </div>
  );
};
