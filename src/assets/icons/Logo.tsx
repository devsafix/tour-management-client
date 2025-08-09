import { Link } from "react-router";
import logo from "../images/tour-logo.png";

export default function Logo() {
  return (
    <Link to="/">
      <img src={logo} alt="" className="size-16 rounded-full" />
    </Link>
  );
}
