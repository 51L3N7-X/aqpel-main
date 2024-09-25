import { Checkbox, Divider } from "@nextui-org/react";
import type { FloorData, TableItems } from "@repo/types";
import { useState } from "react";

export const CheckBoxTables = ({
  data,
  key,
  tables,
  setTables,
}: {
  data: FloorData;
  key: any;
  tables: any;
  setTables: any;
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>(tables);

  return (
    <div className="overflow-hidden">
      <Checkbox
        onChange={(e) => {
          const ids = data.tables.map((table) => table.id);
          setCheckedItems(e.target.checked ? ids : []);
          if (e.target.checked) {
            setTables([...tables, ...ids]);
          } else {
            setTables(tables.filter((id: any) => !ids.includes(id)));
          }
        }}
        key={key}
      >
        Select all
      </Checkbox>
      <Divider />
      <br />
      {data.tables.map((table: TableItems) => (
        <Checkbox
          value={table.id}
          isSelected={checkedItems.includes(table.id)}
          onChange={(event) => {
            const newCheckedItems = [...checkedItems];
            let newTables = [...tables, event.target.value];
            if (tables.includes(event.target.value)) {
              newTables = newTables.filter(
                (dasTable) => dasTable !== event.target.value,
              );
            }
            if (event.target.checked) {
              newCheckedItems.push(table.id);
            } else {
              newCheckedItems.splice(newCheckedItems.indexOf(table.id), 1);
            }
            setCheckedItems(newCheckedItems);
            setTables(newTables);
          }}
        >
          {table.number}
        </Checkbox>
      ))}
    </div>
  );
};
