/* eslint-disable object-curly-newline */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react/jsx-wrap-multilines */

"use client";

import { CircularProgress } from "@nextui-org/react";
import type { TableData } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import * as htmlToImage from "html-to-image";
import React, { useEffect, useRef, useState } from "react";
import QRcode from "react-qr-code";
import ReactToPrint from "react-to-print";

import api from "@/lib/api";

export default function TableDetails({
  floorId,
  tableId,
}: {
  floorId: string;
  tableId: string;
}) {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(100);
  const qrCodeRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);

  const { isLoading, data: table } = useQuery({
    queryKey: ["table"],
    queryFn: async (): Promise<TableData | null> => {
      try {
        const data = await api({
          url: `/floor/${floorId}/table/${tableId}`,
          method: "get",
        });
        return data.data;
      } catch (e: any) {
        if (e.response.data.code === 404) return null;
        throw e;
      }
    },
  });

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;
    htmlToImage
      .toPng(qrCodeRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${table?.number}.png`;
        link.click();
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        alert("Error generating QR code:");
      });
  };

  useEffect(() => {
    if (window) {
      if (process.env.NODE_ENV === "development") {
        setUrl(`http://${window.location.hostname}:3000/order/${table?.id}`);
      } else {
        setUrl(`https://${window.location.host}/order/${table?.id}`);
      }
    }
  }, [table?.id]);

  const reactToPrintContent = React.useCallback(
    () =>
      // const element = <QRcode value={url} size={1000} ref={tempRef} />;
      qrCodeRef.current,
    [],
  );

  const handleOnBeforeGetContent = React.useCallback(() => {
    setSize(1000);

    return new Promise((resolve) => {
      // @ts-ignore
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setSize(100);
        resolve(true);
      }, 2000);
    });
  }, [setSize]);

  useEffect(() => {
    if (
      size === 1000 &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      // @ts-ignore
      onBeforeGetContentResolve.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBeforeGetContentResolve.current, size]);

  const reactToPrintTrigger = () => (
    <div className="mx-6 flex h-11 w-[420px] cursor-pointer items-center justify-center rounded-[10px] bg-primary">
      <p className=" text-2xl font-bold text-white1">Print QR</p>
    </div>
  );
  return (
    <div>
      {isLoading ? (
        <div className="flex size-full items-center justify-center">
          <CircularProgress
            label={
              <h1 className="text-lg font-bold text-primary">Downloading...</h1>
            }
            size="lg"
          />
        </div>
      ) : (
        <div className=" relative">
          <div className="mt-6 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-primary">Qr Code</h3>
            <div
              className="mt-3 cursor-pointer rounded-2xl border-4 border-dashed border-primary p-2"
              onClick={downloadQRCode}
              aria-label="qr"
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              <div ref={qrCodeRef}>
                <QRcode value={url} size={size} />
              </div>
            </div>
          </div>
          <div className="m-6 flex items-center justify-between">
            <div className="flex flex-col items-start justify-center">
              <h3 className="text-xl font-bold text-primary">Table Page URL</h3>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className=" text-xl text-blue-400 underline  decoration-blue-400 hover:text-blue-600 hover:decoration-blue-600"
              >
                Page
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Chairs Number</h3>
              <p className="text-xl font-bold">
                {table?.chairs} {+table!.chairs === 1 ? "Chair" : "Chairs"}
              </p>
            </div>
          </div>
          <ReactToPrint
            content={reactToPrintContent}
            onBeforeGetContent={handleOnBeforeGetContent}
            trigger={reactToPrintTrigger}
          />
          <div className="mx-6 mb-6 mt-2 flex h-11 w-[420px] cursor-pointer items-center justify-center rounded-[10px] bg-delete">
            <p className=" text-2xl font-bold text-white1">Delete</p>
          </div>
        </div>
      )}
    </div>
  );
}
