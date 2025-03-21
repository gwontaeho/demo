import { Control } from "../modules/control";

const options = [
  { label: "a", value: "a" },
  { label: "b", value: "b" },
];

export const SampleControl = () => {
  const handleChange = (value) => {
    console.log(value);
  };

  return (
    <div>
      <Control type="text" onChange={handleChange} />
      <Control type="number" onChange={handleChange} />
      <Control type="textarea" onChange={handleChange} />
      <Control type="select" options={options} onChange={handleChange} />
      <Control type="radio" options={options} onChange={handleChange} />
      <Control type="checkbox" options={options} onChange={handleChange} />
      <Control type="date" onChange={handleChange} />
      <Control type="time" onChange={handleChange} />
    </div>
  );
};
