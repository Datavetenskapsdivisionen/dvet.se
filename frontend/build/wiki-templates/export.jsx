
const me = () => {
    const params = useParams();
    const isHemlis = location.pathname.includes("${SECRET_DIR}");
    let path = "/" + params.id + "/" + params["*"];
    path = path.replaceAll("/", "__");
    if (path.endsWith("__")) {
        path = path.slice(0, -2);
    }
    if (isHemlis) path = "__${SECRET_DIR}" + path;
    if (path == "__undefined__undefined") path = "__About_Us";

    ${paths} {
        return <h1>404 invalid uri</h1>;
    };
};
export default me;