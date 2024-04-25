import fs from "fs";
import S from "fluent-json-schema";
import Ajv from "ajv";

const infoScreenSchema = S.object()
    .prop("name", S.string())
    .prop("duration", S.integer())
    .prop("startDate", S.integer())
    .prop("endDate", S.integer())
    .prop("active", S.boolean())
    .prop("slide", S.oneOf([
        S.object()
            .prop("type", S.string().enum(["iframe"]))
            .prop("src", S.string())
            .required(["type", "src"]),
        S.object()
            .prop("type", S.string().enum(["img"]))
            .prop("src", S.string())
            .required(["type", "src"]),
        S.object()
            .prop("type", S.string().enum(["markdown"]))
            .prop("content", S.string())
            .required(["type", "content"])
    ]))
    .required(["name", "duration", "slide"]);

const fullSchema = S.array().items(infoScreenSchema);
const ajv = new Ajv();
const validator = ajv.compile(fullSchema.valueOf());

const getSlides = async (req, res) => {
    var slides;
    try {
        slides = JSON.parse(fs.readFileSync("./info-screen-slides.json"));
    } catch (err) {
        slides = [];
    }
    
    const isValid = validator(slides);
    if (!isValid) {
        console.log("The info screen JSON data is not valid.");
        console.log(validator.errors);
        res.json({ error: "The info screen JSON data is not valid." });
        return;
    }

    res.json(slides);
};

const updateSlides = async (req, res) => {
    const slides = req.body;
    if (!slides || !validator(slides)) {
        console.log(validator.errors.msg);
        res.json({error: "The provided slides contains errors. Please check the JSON schema.\n" + validator.errors.msg});
        return;
    }

    fs.writeFile("./info-screen-slides.json", JSON.stringify(slides), error => {
        if (error) {
            res.json({error: error});
            return;
        }
    });

    res.json({"msg": "Slides updated!"});
};

export { getSlides, updateSlides };
