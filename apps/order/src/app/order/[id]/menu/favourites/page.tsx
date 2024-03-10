import React from "react";

import HorzItems from "@/components/Menu/HorzItems/HorzItems";
import TopBar from "@/components/Menu/TopBar/TopBar";

export default function Favourites() {
  // const [items, setItems] = useState<Array<Store>>([]);

  // useEffect(() => {
  //   const favStore = new FavStore();
  //   const Tempitems = favStore.getAll();
  //   setItems(Tempitems);
  // }, []);

  return (
    <div className="font-poppins">
      <TopBar title="Favourites" />
      <h2 className="mx-6 my-4 text-[22px] font-medium capitalize text-text">
        Favorite Dishes
      </h2>
      <HorzItems type="fav" />
    </div>
  );
}
