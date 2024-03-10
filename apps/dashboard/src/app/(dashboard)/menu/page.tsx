"use client";

import React, { useState } from "react";

import AddItem from "@/components/auth/AddItem";
import DialogComponent from "@/components/Dialog";
import ItemsContainer from "@/components/ItemsContainer";
import NewMenuForm from "@/components/NewMenuForm";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  // const editor = useRef(null);
  // const [src, setSrc] = useState("");

  // const getImageUrl = async () => {
  //   const dataUrl = editor.current?.getImage().toBlob((data) => {
  //     console.log(data);
  //   });
  //   console.log(dataUrl);
  //   const res = await fetch(dataUrl);
  //   // res.
  //   const blob = await res.blob();

  //   console.log(blob);

  //   return window.URL.createObjectURL(blob);
  // };

  // Usage

  const closeModal = () => {
    // setFile("");
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  // const onSave = () => {
  //   alert();
  //   // console.log(editor.current?.getImage());
  //   // getImageUrl().then((image) => setSrc(image));
  // };

  return (
    <div>
      <ItemsContainer>
        <AddItem text="Add a menu" onClick={openModal} />
      </ItemsContainer>
      <DialogComponent onClose={closeModal} isOpen={isOpen}>
        <NewMenuForm
          // file={file}
          // setFile={setFile}
          closeModal={closeModal}
          // onSave={onSave}
        />
      </DialogComponent>
    </div>
  );
}
