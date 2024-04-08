import { Inter } from "next/font/google";
import Login from "./login";

const inter = Inter({ subsets: ["latin"] });

export default function index() {
  return (
    <div>
      <Login />
    </div>
  );
}
