import { useState } from "react";
import { useFetch } from "../../module/fetch";
import { Doc } from "../doc-template";

export const SampleFetch = () => {
  const [test, setTest] = useState(0);

  const mockApi = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["a", test]);
      }, 2000);
    });
  };

  const { data, fetchData } = useFetch({
    fetcher: () => {},
    formatter: () => {},
    onSuccess: () => {},
    onError: () => {},
    enabled: true,
    enabledTimeout: true,
    enabledInterval: true,
    timeout: 2000,
    interval: 2000,
    key: [],
  });

  console.log(data);

  return (
    <Doc>
      <Doc.H1>fetch</Doc.H1>

      <Doc.H2># useFetch()</Doc.H2>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <Doc.Code>{`const { data, fetchData } = useFetch({
  fetcher: () => {},
  formatter: () => {},
  onSuccess: () => {},
  onError: () => {},
  enabled: true,
  enabledTimeout: true,
  enabledInterval: true,
  timeout: 2000,
  interval: 2000,
  key: [],
})`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>fetcher</td>
              <td></td>
            </tr>
            <tr>
              <td>formatter</td>
              <td></td>
            </tr>
            <tr>
              <td>onSuccess</td>
              <td></td>
            </tr>
            <tr>
              <td>onError</td>
              <td></td>
            </tr>
            <tr>
              <td>enabled</td>
              <td></td>
            </tr>
            <tr>
              <td>enabledTimeout</td>
              <td></td>
            </tr>
            <tr>
              <td>enabledInterval</td>
              <td></td>
            </tr>
            <tr>
              <td>timeout</td>
              <td></td>
            </tr>
            <tr>
              <td>interval</td>
              <td></td>
            </tr>
            <tr>
              <td>key</td>
              <td></td>
            </tr>
          </tbody>
        </Doc.Table>
      </Doc.Item>
    </Doc>
  );
};
