import fs from "fs";
import Ajv from "ajv";

const schema = {
    type: "object",
    properties: {
        shuffle: { type: "boolean" },
        slides: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name:     { type: "string" },
                    duration: { type: "integer" },
                    start:    { type: ["integer", "null"] },
                    end:      { type: ["integer", "null"] },
                    active:   { type: "boolean" },
                    lastEdit: { type: "string" },
                    slide: {
                        type: "object",
                        properties: {
                            slideType: { enum: ["iframe", "img", "markdown"] },
                            value:     { type: "string" }
                        },
                        required: ["slideType", "value"]
                    },
                },
                required: ["name", "duration", "slide"]
            }
        }
    },
    required: ["slides"]
}
    
const ajv = new Ajv();
const validator = ajv.compile(schema);

const getSlides = async (req, res) => {
    let slides;
    try {
        slides = JSON.parse(fs.readFileSync("./info-screen-slides.json"));
    } catch (err) {
        slides = {slides: []};
    }
    
    const isValid = validator(slides);
    if (!isValid) {
        console.log("The info screen JSON data is not valid.");
        console.log(validator.errors);
        res.status(400).json({ error: "The info screen JSON data is not valid." });
        return;
    }

    res.status(200).json(slides);
};

const updateSlides = async (req, res) => {
    const slides = req.body;
    if (!slides || !validator(slides)) {
        console.log("The provided slides contains errors. Please check the JSON schema.\n\tError message: " + validator.errors.msg);
        res.status(400).json({error: "The provided slides contains errors. Please check the JSON schema.\n\tError message: " + validator.errors.msg});
        return;
    }

    fs.writeFile("./info-screen-slides.json", JSON.stringify(slides), error => {
        if (error) {
            res.status(400).json({error: error});
            return;
        }
    });

    res.status(200).json({"msg": "Slides updated!"});
};

export { getSlides, updateSlides };
