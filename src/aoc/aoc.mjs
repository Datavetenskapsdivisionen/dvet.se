const aoc = async (req, res) => {
    let time = new Date().getTime();
    let countdown = Date.parse("2023-12-01T06:00:00+01:00");
    let diffSecs = (countdown - time) / 1000;
    let diffMins = diffSecs / 60;
    let diffHours = diffMins / 60;
    let diffDays = diffHours / 24;
    res.json({
        diffSecs: diffSecs,
        diffMins: diffMins,
        diffHours: diffHours,
        diffDays: diffDays
    });
};

export default aoc;