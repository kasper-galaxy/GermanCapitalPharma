import {randomColor} from "./utils";

// https://codesandbox.io/s/editable-react-table-gchwp?fontsize=14&hidenavigation=1&theme=dark

export default function makeData(ingredient) {
  const { data, columns } = ingredient;
  return {columns: columns, data: data, skipReset: false};
}
