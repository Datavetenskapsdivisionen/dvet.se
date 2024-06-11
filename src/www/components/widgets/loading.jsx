import React, { Suspense } from "react";

const Loading = ({ Child, childProps }) => {
    let child = childProps ? <Child {...childProps} /> : <Child />;
    return <Suspense fallback={<div>Loading...</div>}>
        {child}
    </Suspense>;
};

export default Loading;