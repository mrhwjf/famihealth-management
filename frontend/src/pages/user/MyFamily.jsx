import React from "react";
import useIsMobile from '../../hooks/useIsMobile';
export default function MyFamily() {
  const isMobile = useIsMobile();
  return <div>My Family Page</div>;
}
