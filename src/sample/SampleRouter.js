import { useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "../modules/router";

const Router1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  return (
    <div>
      <div>111</div>
      <button onClick={() => navigate("/aa?tt=44")}>go 2</button>
      <button onClick={() => navigate("?tt=3")}>add query</button>
    </div>
  );
};

const Router2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  return (
    <div>
      <div>222</div>
      <button onClick={() => navigate("/")}>go 111</button>
      <button onClick={() => navigate("/aa/566")}>go 333</button>
      <button onClick={() => navigate("/aa/566/fff")}>go 444</button>
    </div>
  );
};

const Router3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  return (
    <div>
      <div>333</div>
      <button onClick={() => navigate("/")}>go 111</button>
      <button onClick={() => navigate("/aa/wdq/66tt/t")}>go 444</button>
    </div>
  );
};

const Router4 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  return (
    <div>
      <div>444</div>
      <button onClick={() => navigate("/")}>go 111</button>
      <button onClick={() => navigate("/aa/562")}>go 333</button>
      <button onClick={() => navigate("/aa/562ff/bb/ww66/44")}>go 555</button>
    </div>
  );
};

const Router5 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  useEffect(() => {}, []);

  return (
    <div>
      <div>555</div>
      <button onClick={() => navigate("/")}>go 111</button>
      <button onClick={() => navigate("/aa/562")}>go 333</button>
    </div>
  );
};

const Test = () => {
  let navigate = useNavigate();
  navigate = "a";
  return (
    <div>
      <div
        onClick={() => {
          console.log(navigate);
        }}
      >
        qwdw
      </div>
    </div>
  );
};

const Test2 = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        onClick={() => {
          console.log(navigate);
        }}
      >
        qwdw
      </div>
    </div>
  );
};

export const SampleRouter = () => {
  return (
    <div>
      <Test />
      <Test2 />
      <Routes>
        <Route path="/" element={<Router1 />} />
        <Route path="/aa" element={<Router2 />} />
        <Route path="/aa/:id" element={<Router3 />} />
        <Route path="/aa/:id/bb/:test/44" element={<Router5 />} />
        <Route path="/aa/:id/*" element={<Router4 />} />
      </Routes>
    </div>
  );
};
