import React from "react";
import useIsMobile from '../../hooks/useIsMobile';
export default function Settings() {
  const isMobile = useIsMobile();
  return <div>Settings Page</div>;
}
