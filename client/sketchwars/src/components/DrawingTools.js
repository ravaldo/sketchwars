import React from 'react'
import './DrawingTools.css';

const DrawingTools = ({ setBrushColour, setBrushSize, clearCanvas }) => {

    const clearCanvasSound = new Audio(require('../sounds/scrapSound.mp3'));
    const changeBrushSound = new Audio(require('../sounds/changeBrushSizeSound.mp3'));
    const changeColourSound = new Audio(require('../sounds/selectColourSound.mp3'));
    const colours = ["#000", "#EC2324", "#02AEEF", "#8DC53F", "#F6D61E", "#F7931F", "#517E14", "#024997", "#AF2277", "#FFF"];

    const handleColourClick = (e) => {
        const selection = e.target.getAttribute('id');
        setBrushColour(selection)
        document.querySelector(".color.selected").classList.remove("selected");
        e.target.classList.add('selected');
        changeColourSound.currentTime = 0;
        changeColourSound.play()
    }

    const handleOtherClick = (e) => {
        const selection = e.currentTarget.firstElementChild.getAttribute('id');
        if (selection == "clear") {
            clearCanvas()
            clearCanvasSound.currentTime = 0;
            clearCanvasSound.play()
        }
        if (selection.endsWith("Brush")) {
            document.querySelector(".brush.selected").classList.remove("selected");
            e.currentTarget.classList.add('selected');
            setBrushSize(selection)
            changeBrushSound.currentTime = 0;
            changeBrushSound.play()
        }
    };

    const swatches = colours.map(colour => {
        return <div className={colour == "#000" ? "tool color selected" : "tool color"}
            key={colour}
            id={colour}
            style={{ backgroundColor: colour }}
            onClick={handleColourClick}
        ></div>
    });

    return (
        <>
            <div className="toolbar">
                {swatches}
                <div className="tool blank"></div>
                <div className="tool brush selected" onClick={handleOtherClick}><div id="smallBrush"></div></div>
                <div className="tool brush" onClick={handleOtherClick}><div id="mediumBrush"></div></div>
                <div className="tool brush" onClick={handleOtherClick}><div id="largeBrush"></div></div>
                <div className="tool blank"></div>
                <div className="tool brush" onClick={handleOtherClick}>
                    <div id="clear">C</div></div>
            </div>
        </>
    )

}

export default DrawingTools