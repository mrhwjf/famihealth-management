import { useState, useEffect } from "react";

const delayDefault = 2000; // Default delay of 2 seconds

const useDebounce = (value, delay = delayDefault) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
