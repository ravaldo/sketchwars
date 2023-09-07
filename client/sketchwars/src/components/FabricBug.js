import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

/*
navigating back from this page produces an error
  ERROR
  Node.removeChild: The node to be removed is not a child of this node
  removeChildFromContainer@http://localhost:3000/static

seems to be caused by "canvas.lower-canvas" and its supposed parent "div#root"
coming into line 11105 in react-dom.development.js


    <div id="root">
        <div className="canvas-container" style="width: 247px; height: 769px; position: relative; user-select: none;">
            <canvas className="lower-canvas"
                style="position: absolute; width: 247px; height: 769px; left: 0px; top: 0px; touch-action: none; user-select: none;"
                width="247" height="769">
            </canvas>
            <canvas className="upper-canvas "
                style="position: absolute; width: 247px; height: 769px; left: 0px; top: 0px; touch-action: none; user-select: none; cursor: crosshair;"
                width="247" height="769">
            </canvas>
        </div>
    </div>

*/

const Fabric = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas("foo", {
      isDrawingMode: true,
      backgroundColor: "#aaa",
    });
    canvasRef.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="foo" />
      <p>test</p>
    </>
  );
};

export default Fabric;
