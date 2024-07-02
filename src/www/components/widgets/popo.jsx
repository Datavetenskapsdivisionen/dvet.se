import React from "react";

const me = () => {
    const [tickLoop, setTickLoop] = React.useState();
    const [pos, setPos] = React.useState([-20, 50]);
    const [rot, setRot] = React.useState(0);
    const posRef = React.useRef();
    posRef.current = pos;

    // Tick callback
    const tick = () => {
        const pos_old = posRef.current;
        const pos_new = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
        const w = window.screen.width;
        const h = window.screen.height;
        setPos(pos_new);
        setRot(Math.atan2(pos_old[1] * h - pos_new[1] * h, pos_old[0] * w - pos_new[0] * w));
    }

    React.useEffect(() => {
        // Initialize tick loop
        setInterval(tick, 3000);
        // Bit dumb but prevents instant transmission
        setTimeout(tick, 10);

        return () => {
            // Stop tick loop (hopefully no race condition? eh)
            clearInterval(tickLoop);
        }
    }, [])

    // Flip that shiz
    const inv = ((rot < 3.14 / 2 && rot > -3.14 / 2) ? 1 : -1)

    return (
        <div className="popo" style={{
            top: pos[1] + "vh",
            left: pos[0] + "vw",
            transform: "translate(-50%,-50%) " + "scaleY(" + inv + ") " + "rotateZ(" + rot * inv + "rad)"
        }} />
    );
}

export default me;