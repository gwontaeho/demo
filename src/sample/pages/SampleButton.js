import { Button } from "../../module/button";
import { Doc } from "../doc-template";

export const SampleButton = () => {
  return (
    <Doc>
      <Doc.H1>button</Doc.H1>

      <Doc.H2>{`# <Button />`}</Doc.H2>

      <Doc.H3>{`properties`}</Doc.H3>

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
              <td>role</td>
              <td></td>
            </tr>
            <tr>
              <td>onClick</td>
              <td></td>
            </tr>
          </tbody>
        </Doc.Table>
      </Doc.Item>

      <Doc.Item>
        <Doc.Desc>with role</Doc.Desc>
        <div className="flex flex-col flex-1">
          <Doc.Result>
            <Button role="cancel"></Button>
          </Doc.Result>
          <Doc.Code>{`<Button role="cancel"></Button>`}</Doc.Code>
        </div>
      </Doc.Item>

      <Doc.Item>
        <Doc.Desc>with children</Doc.Desc>
        <div className="flex flex-col flex-1">
          <Doc.Result>
            <Button>Press me</Button>
          </Doc.Result>
          <Doc.Code>{`<Button>Press me</Button>`}</Doc.Code>
        </div>
      </Doc.Item>
    </Doc>
  );
};
