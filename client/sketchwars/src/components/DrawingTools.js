import React from 'react'
import './DrawingTools.css';
import scrapSound from '../sounds/scrapSound.mp3'
import changeBrushSizeSound from '../sounds/changeBrushSizeSound.mp3'
import selectColourSound from '../sounds/selectColourSound.mp3'

const DrawingTools = ({ setBrushColour, setBrushSize, clearCanvas }) => {

    function playScrapSound() {
        new Audio(scrapSound).play()
    }
    function playChangeBrushSizeSound() {
        new Audio(changeBrushSizeSound).play()
    }
    function selectColourSFX() {
        new Audio(selectColourSound).play()
    }


    const colours = ["#000", "#EC2324", "#02AEEF", "#8DC53F", "#F6D61E", "#F7931F", "#517E14", "#024997", "#AF2277", "#FFF"];

    const handleColourClick = (e) => {
        const selection = e.target.getAttribute('id');
        setBrushColour(selection)
        document.querySelector(".color.selected").classList.remove("selected");
        e.target.classList.add('selected');
        selectColourSFX()
    }

    const handleOtherClick = (e) => {
        const selection = e.currentTarget.firstElementChild.getAttribute('id');
        if (selection == "clear")
            clearCanvas()
        if (selection.endsWith("Brush")) {
            document.querySelector(".brush.selected").classList.remove("selected");
            e.currentTarget.classList.add('selected');
            setBrushSize(selection)

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
                <div className="tool brush selected" onClick={(e) => {handleOtherClick(e); playChangeBrushSizeSound();}}><div id="smallBrush"></div></div>
                <div className="tool brush" onClick={(e) => {handleOtherClick(e); playChangeBrushSizeSound();}}><div id="mediumBrush"></div></div>
                <div className="tool brush" onClick={(e) => {handleOtherClick(e); playChangeBrushSizeSound();}}><div id="largeBrush"></div></div>
                <div className="tool blank"></div>
                <div className="tool brush" onClick={(e) => {handleOtherClick(e); playScrapSound();}}>
        <div id="clear">C</div></div>
            </div>
        </>
    )

}

export default DrawingTools