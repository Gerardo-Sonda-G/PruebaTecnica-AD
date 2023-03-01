import { Link } from "react-router-dom";
import "./error.css";

export default function ErrorPage() {
	return (
		<div>
			<h2>Nothing to see here!</h2>
			<p>
				<Link to="/">Go to the home page of the app</Link>
			</p>
		</div>
	);
}
