import React, { Suspense } from "react";

const Loading = ({ Child, childProps }) => {
    let child = childProps ? <Child {...childProps} /> : <Child />;
    return <Suspense>
        {child}
    </Suspense>;
};

export default Loading;