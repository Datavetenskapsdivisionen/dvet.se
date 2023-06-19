const isReception = () => {
    const fromDate = new Date(Date.parse(`${new Date().getFullYear()}-07-12`));
    const toDate = new Date(Date.parse(`${new Date().getFullYear()}-09-17`));
    return (new Date().getDate() >= fromDate.getDate())
        && (new Date().getDate() <= toDate.getDate());
};

export { isReception };