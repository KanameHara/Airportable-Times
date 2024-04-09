import { Inter } from "next/font/google";
import Signin from "./signin";

const inter = Inter({ subsets: ["latin"] });

export default function index() {
  return (
    <div>
      <Signin />
    </div>
  );
}
