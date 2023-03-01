import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard";
import "./index.css";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<HashRouter>
			<Dashboard />
		</HashRouter>
	</React.StrictMode>,
);
