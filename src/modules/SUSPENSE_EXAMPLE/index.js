// import { Suspense, use } from "react";

// const TestSuspense = ({ children }) => {
//   return <Suspense>{children}</Suspense>;
// };

// const fn = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 3000);
//   });
// };

// const HoldComponent = ({ children }) => {
//   use(fn);

//   return children;
// };

// export { TestSuspense, HoldComponent };
