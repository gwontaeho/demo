import { Icon } from "../../module/icon";
import { Doc } from "../doc-template";

export const SampleIcon = () => {
  return (
    <Doc>
      <Doc.H1>icon</Doc.H1>

      <Doc.H2>{`# <Icon />`}</Doc.H2>

      <Doc.H3>properties</Doc.H3>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <div className="flex flex-col flex-1">
          <Doc.Result>
            <Icon name="search" />
          </Doc.Result>
          <Doc.Code>{`<Icon name="search" />`}</Doc.Code>
        </div>
      </Doc.Item>
    </Doc>
  );
};
