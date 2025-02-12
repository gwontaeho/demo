import { useResource } from "../modules/resource";

export const SampleResource = () => {
  const { getResource } = useResource([{ key: "a" }, { key: "b" }]);

  const test1 = () => {
    console.log("1");
  };

  const tt = () => {
    return new Promise((resolve) => {
      resolve(2);
    });
  };

  const test2 = async () => {
    console.log(await tt());
  };

  const test3 = () => {
    console.log("3");
  };

  const gett = async () => {
    console.log(await getResource("a"));
  };

  return (
    <div>
      <button
        onClick={() => {
          // test1();
          // test2();
          // test3();
          gett();
        }}
      >
        get resource a
      </button>
    </div>
  );
};
