import CVApp from "./components/CVApp";
import { cv } from "./data/cv";

export default function Home() {
  return <CVApp cv={cv} initialTheme="notion" indexMode />;
}
