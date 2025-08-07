import { Outlet } from "react-router";
import CommonLayout from "./components/layout/commonLayout";

function App() {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}

export default App;
