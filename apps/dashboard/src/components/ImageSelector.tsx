"use client";

import "rc-slider/assets/index.css";

import Image from "next/image";
import Slider from "rc-slider";
import type { Dispatch } from "react";
import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#0098AA";
  }
  return "#0098AA";
};

const Container = styled.div<{ $edit: boolean }>`
  border-color: ${(props) => getColor(props)};
  height: ${(props) => (props.$edit ? "320px" : "290px")};
`;

export default function ImageSelector({
  file,
  setFile,
}: {
  file: File | string;
  setFile: Dispatch<File | string>;
}) {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    // maxSize: 2048,
    noKeyboard: true,
    noClick: true,
    onDrop: (acceptedFile) => {
      setFile(acceptedFile[0]);
    },
  });

  const [size, setSize] = useState(10);
  return (
    <div>
      <Container
        {...getRootProps({ isFocused, isDragAccept, isDragReject })}
        $edit={!!file}
        className=" relative mb-6 flex w-full select-none flex-col items-center justify-center rounded-xl border-4 border-dashed border-primary text-primary outline-none"
      >
        <input {...getInputProps()} className="outline-none" />
        {file ? (
          <>
            <AvatarEditor
              width={250}
              height={250}
              image={file}
              borderRadius={999}
              scale={size / 10}
              //   ref={editor}
              // color={[255, 255, 255]}
              // backgroundColor="transparent"
              style={{ width: "250px", height: "250px" }}
              className="mb-3  border"
            />
            <Slider
              min={10}
              max={30}
              step={1}
              defaultValue={10}
              styles={{
                track: { backgroundColor: "#0098AA", height: "10px" },
                rail: { backgroundColor: "#46b6c275", height: "10px" },
                handle: {
                  height: "20px",
                  width: "20px",
                },
              }}
              style={{
                width: "250px",
              }}
              onChange={(value) => setSize(value as number)}
            />
            <Image
              src="/ImageIcon.svg"
              alt="resize image"
              width={32}
              height={32}
              className="absolute  bottom-1 left-11"
            />
            <Image
              src="/ImageIcon.svg"
              alt="resize image"
              width={48}
              height={48}
              className=" absolute bottom-1 right-8"
            />
          </>
        ) : (
          <>
            <Image
              src="/AddImageIcon.svg"
              width={99}
              height={99}
              alt="add image"
              className=" mb-6"
            />
            <p className="mb-4 text-2xl font-bold">
              Drag and drop a PNG file here
            </p>
            <p className=" mb-3 text-xl  font-bold">OR</p>
            <div
              className="flex h-11 w-[385px] cursor-pointer items-center justify-center rounded-[10px] bg-primary text-white1"
              onClick={open}
              aria-hidden="true"
            >
              <p className="text-center text-[22px] font-bold">
                Select a file from computer
              </p>
            </div>
          </>
        )}
      </Container>
      <div className="mx-auto mb-5 flex max-w-[382px] flex-row space-x-[14px]">
        <div
          className=" flex h-11 w-[184px] cursor-pointer items-center justify-center rounded-[10px] bg-primary text-[22px] font-bold text-white1"
          onClick={open}
          aria-hidden
        >
          Replace
        </div>
        <div
          className="flex h-11 w-[184px] cursor-pointer items-center  justify-center rounded-[10px] border border-primary text-[22px] font-bold text-primary"
          onClick={() => setFile("")}
          aria-hidden
        >
          Remove
        </div>
      </div>
    </div>
  );
}
