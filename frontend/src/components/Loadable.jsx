// src/components/Loadable.jsx
import React, { Suspense } from 'react';
import Loader from './Loader';

const Loadable = (importFunc) => {
  const LazyComponent = React.lazy(importFunc);

  return (props) => (
    <Suspense fallback={<Loader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default Loadable;
