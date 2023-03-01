import * as React from "react";

import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import EventsList from "../components/eventsList";
import { useEffect, useState } from "react";

export default function Events() {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const controller = new AbortController();
		queryEvents(controller)
			.then((result) => {
				setEvents(result);
			})
			.catch(() => {});
		return () => {
			controller.abort();
		};
	}, []);

	return (
		<>
			<h1>Todos los eventos</h1>
			<div
				style={{
					marginBottom: "25px",
					display: "flex",
					justifyContent: "flex-end",
					width: "100%",
				}}
			>
				<Link to={"/addEvent"}>
					<Button variant="contained" size="large">
						Crear nuevo evento
					</Button>
				</Link>
			</div>
			<EventsList type="default" events={events} />
		</>
	);
}

async function queryEvents(controller) {
	const response = await fetch(
		"/graphql",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `query{
				getEvents {
					id,
					name,
					address,
					start_date,
					end_date,
				  }
			}`,
			}),
		},
		{ signal: controller.signal },
	);
	let events = await response.json();
	return events.data.getEvents;
}
