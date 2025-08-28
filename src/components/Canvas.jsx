import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Rnd } from "react-rnd";
import { select, toggleSelect, updateElement } from "../store/canvasSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CANVAS_W = 600;
const CANVAS_H = 350;
const SNAP_THRESHOLD = 8;

function ElementRenderer({ el }) {
  const style = {
    width: el.width,
    height: el.height,
    transform: `rotate(${el.rotation}deg)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
  };
  if (el.type === "rect")
    return <div style={{ ...style, background: el.props.fill }} />;
  if (el.type === "circle")
    return (
      <div
        style={{ ...style, borderRadius: "50%", background: el.props.fill }}
      />
    );
  if (el.type === "line")
    return <div style={{ ...style, background: el.props.stroke }} />;
  if (el.type === "text")
    return (
      <div style={style}>
        <div
          style={{
            fontSize: el.props.fontSize,
            color: el.props.color,
            fontWeight: el.props.bold ? "700" : "400",
            fontStyle: el.props.italic ? "italic" : "normal",
            textDecoration: el.props.underline ? "underline" : "none",
          }}
        >
          {el.props.text}
        </div>
      </div>
    );
  if (el.type === "image") {
    const { opacity = 1, crop = { x: 0, y: 0, width: 1, height: 1 } } =
      el.props;
    return (
      <div style={{ ...style, overflow: "hidden", opacity }}>
        <img
          src={el.props.src}
          alt="uploaded"
          style={{
            width: `${100 / crop.width}%`,
            height: `${100 / crop.height}%`,
            objectFit: "cover",
            transform: `translate(-${crop.x * 100}%, -${crop.y * 100}%)`,
          }}
        />
      </div>
    );
  }
  return null;
}

function computeGuidesAndSnap(targetRect, elements, movingId) {
  const candidatesV = [];
  const candidatesH = [];

  candidatesV.push({ x: 0 }, { x: CANVAS_W / 2 }, { x: CANVAS_W });
  candidatesH.push({ y: 0 }, { y: CANVAS_H / 2 }, { y: CANVAS_H });

  elements.forEach((el) => {
    if (el.id === movingId) return;
    const left = el.x;
    const right = el.x + el.width;
    const cx = el.x + el.width / 2;
    const top = el.y;
    const bottom = el.y + el.height;
    const cy = el.y + el.height / 2;

    candidatesV.push({ x: left }, { x: cx }, { x: right });
    candidatesH.push({ y: top }, { y: cy }, { y: bottom });
  });

  const tLeft = targetRect.left;
  const tRight = targetRect.left + targetRect.width;
  const tCenterX = targetRect.left + targetRect.width / 2;
  const tTop = targetRect.top;
  const tBottom = targetRect.top + targetRect.height;
  const tCenterY = targetRect.top + targetRect.height / 2;

  let snapX = null;
  let snapY = null;
  const vGuides = [];
  const hGuides = [];

  candidatesV.forEach((c) => {
    const dxLeft = Math.abs(tLeft - c.x);
    const dxCenter = Math.abs(tCenterX - c.x);
    const dxRight = Math.abs(tRight - c.x);
    const minDx = Math.min(dxLeft, dxCenter, dxRight);
    if (minDx <= SNAP_THRESHOLD) {
      if (minDx === dxLeft) {
        const delta = c.x - tLeft;
        if (!snapX || Math.abs(delta) < Math.abs(snapX.delta))
          snapX = { delta, guideX: c.x };
      } else if (minDx === dxCenter) {
        const delta = c.x - tCenterX;
        if (!snapX || Math.abs(delta) < Math.abs(snapX.delta))
          snapX = { delta, guideX: c.x };
      } else {
        const delta = c.x - tRight;
        if (!snapX || Math.abs(delta) < Math.abs(snapX.delta))
          snapX = { delta, guideX: c.x };
      }
    }
  });

  candidatesH.forEach((c) => {
    const dyTop = Math.abs(tTop - c.y);
    const dyCenter = Math.abs(tCenterY - c.y);
    const dyBottom = Math.abs(tBottom - c.y);
    const minDy = Math.min(dyTop, dyCenter, dyBottom);
    if (minDy <= SNAP_THRESHOLD) {
      if (minDy === dyTop) {
        const delta = c.y - tTop;
        if (!snapY || Math.abs(delta) < Math.abs(snapY.delta))
          snapY = { delta, guideY: c.y };
      } else if (minDy === dyCenter) {
        const delta = c.y - tCenterY;
        if (!snapY || Math.abs(delta) < Math.abs(snapY.delta))
          snapY = { delta, guideY: c.y };
      } else {
        const delta = c.y - tBottom;
        if (!snapY || Math.abs(delta) < Math.abs(snapY.delta))
          snapY = { delta, guideY: c.y };
      }
    }
  });

  if (snapX) vGuides.push(snapX.guideX);
  if (snapY) hGuides.push(snapY.guideY);

  return {
    deltaX: snapX ? snapX.delta : 0,
    deltaY: snapY ? snapY.delta : 0,
    vGuides,
    hGuides,
  };
}

export default function Canvas() {
  const elements = useSelector((s) => s.canvas.elements);
  const selected = useSelector((s) => s.canvas.selectedIds);
  const dispatch = useDispatch();
  const containerRef = useRef();
  const canvasRef = useRef();
  const [vGuides, setVGuides] = useState([]);
  const [hGuides, setHGuides] = useState([]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        dispatch({ type: "canvas/undo" });
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        dispatch({ type: "canvas/redo" });
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        if (!selected.length) return;

        const step = e.shiftKey ? 10 : 1;
        selected.forEach((id) => {
          const el = elements.find((x) => x.id === id);
          if (!el) return;

          let newX = el.x;
          let newY = el.y;
          if (e.key === "ArrowUp") newY -= step;
          if (e.key === "ArrowDown") newY += step;
          if (e.key === "ArrowLeft") newX -= step;
          if (e.key === "ArrowRight") newX += step;

          const snap = computeGuidesAndSnap(
            { left: newX, top: newY, width: el.width, height: el.height },
            elements,
            id
          );

          dispatch(
            updateElement({
              id,
              changes: { x: newX + snap.deltaX, y: newY + snap.deltaY },
            })
          );

          setVGuides(snap.vGuides);
          setHGuides(snap.hGuides);
        });

        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch, elements, selected]);

  const onExport = async (type = "png") => {
    const node = canvasRef.current;
    const scale = 2;
    const canvas = await html2canvas(node, { scale });
    if (type === "png") {
      const link = document.createElement("a");
      link.download = "design.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else if (type === "pdf") {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "px",
        format: [CANVAS_W * 2, CANVAS_H * 2],
      });
      pdf.addImage(img, "PNG", 0, 0, CANVAS_W * 2, CANVAS_H * 2);
      pdf.save("design.pdf");
    }
  };

  const handleDrag = useCallback(
    (id, x, y, width, height) => {
      const snap = computeGuidesAndSnap(
        { left: x, top: y, width, height },
        elements,
        id
      );
      setVGuides(snap.vGuides);
      setHGuides(snap.hGuides);
      return { x: x + snap.deltaX, y: y + snap.deltaY };
    },
    [elements]
  );

  const handleResize = useCallback(
    (id, x, y, width, height) => {
      const snap = computeGuidesAndSnap(
        { left: x, top: y, width, height },
        elements,
        id
      );
      setVGuides(snap.vGuides);
      setHGuides(snap.hGuides);
      return { x: x + snap.deltaX, y: y + snap.deltaY, width, height };
    },
    [elements]
  );

  return (
    <section className="flex-1 p-6 items-center justify-center overflow-auto">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => onExport("png")}
            className="px-3 py-1 border rounded"
          >
            Export PNG
          </button>
          <button
            onClick={() => onExport("pdf")}
            className="px-3 py-1 border rounded"
          >
            Export PDF
          </button>
        </div>
        <div
          ref={containerRef}
          className="p-6 bg-gray-50 dark:bg-gray-700 rounded shadow"
        >
          <div
            ref={canvasRef}
            className="relative bg-white dark:bg-gray-800"
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              border: "1px solid grey",
            }}
          >
            {vGuides.map((x, i) => (
              <div
                key={`vg-${i}`}
                className="absolute bg-blue-500"
                style={{
                  left: x,
                  top: 0,
                  height: CANVAS_H,
                  width: 1,
                  transform: "translateX(-0.5px)",
                }}
              />
            ))}
            {hGuides.map((y, i) => (
              <div
                key={`hg-${i}`}
                className="absolute bg-blue-500"
                style={{
                  top: y,
                  left: 0,
                  width: CANVAS_W,
                  height: 1,
                  transform: "translateY(-0.5px)",
                }}
              />
            ))}

            {elements.map((el) => (
              <Rnd
                key={el.id}
                size={{ width: el.width, height: el.height }}
                position={{ x: el.x, y: el.y }}
                onDrag={(e, d) =>
                  handleDrag(el.id, d.x, d.y, el.width, el.height)
                }
                onDragStop={(e, d) => {
                  const snapped = handleDrag(
                    el.id,
                    d.x,
                    d.y,
                    el.width,
                    el.height
                  );
                  dispatch(
                    updateElement({
                      id: el.id,
                      changes: { x: snapped.x, y: snapped.y },
                    })
                  );
                  setVGuides([]);
                  setHGuides([]);
                }}
                onResize={(e, dir, ref, delta, pos) =>
                  handleResize(
                    el.id,
                    pos.x,
                    pos.y,
                    parseFloat(ref.style.width),
                    parseFloat(ref.style.height)
                  )
                }
                onResizeStop={(e, dir, ref, delta, pos) => {
                  const w = parseFloat(ref.style.width);
                  const h = parseFloat(ref.style.height);
                  const snapped = handleResize(el.id, pos.x, pos.y, w, h);
                  dispatch(
                    updateElement({
                      id: el.id,
                      changes: {
                        x: snapped.x,
                        y: snapped.y,
                        width: w,
                        height: h,
                      },
                    })
                  );
                  setVGuides([]);
                  setHGuides([]);
                }}
                bounds="parent"
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.shiftKey) dispatch(toggleSelect(el.id));
                  else dispatch(select([el.id]));
                }}
                style={{ zIndex: 10, transform: `rotate(${el.rotation}deg)` }}
              >
                <div
                  className={`w-full h-full ${
                    selected.includes(el.id)
                      ? "outline outline-2 outline-blue-400"
                      : ""
                  }`}
                >
                  <ElementRenderer el={el} />
                </div>
              </Rnd>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
