import { Control } from "../modules/control";

const options = [
  { label: "a", value: "a" },
  { label: "b", value: "b" },
];

export const SampleControl = () => {
  const handleChange = (e) => {
    console.log(e);
    console.log(e.target.value);
  };

  return (
    <div>
      <Control type="text" onChange={handleChange} />
      <Control type="number" onChange={handleChange} />
      <Control type="textarea" onChange={handleChange} />
      <Control type="select" options={options} onChange={handleChange} />
      <Control type="radio" options={options} onChange={handleChange} />
      <Control type="checkbox" options={options} onChange={handleChange} />
      <Control />
    </div>
  );
};
