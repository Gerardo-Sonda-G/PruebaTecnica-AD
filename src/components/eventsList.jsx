import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { Buy, BuyHeader } from "./buyComponents";

export default function EventsList({ type, events, handleModal }) {
	if (events === null) {
		return (
			<>
				<h1>No hay eventos</h1>
			</>
		);
	}
	return events.map((event) => {
		return (
			<Card key={event.id} sx={{ width: "80%", marginBottom: "25px" }}>
				<CardContent>
					{type === "buy" ? (
						<BuyHeader event={event} handleModal={handleModal} />
					) : (
						<SeeMore name={event.name} id={event.id} />
					)}
					{type === "buy" ? <Buy event={event} /> : <Details event={event} />}
				</CardContent>
			</Card>
		);
	});
}

function SeeMore({ name, id }) {
	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: "25px",
				}}
			>
				<Typography gutterBottom variant="h5" component="div">
					{name}
				</Typography>
				<Link to={`/event/${id}`}>
					<Button variant="contained" size="medium">
						Ver detalles
					</Button>
				</Link>
			</div>
		</>
	);
}

function Details({ event }) {
	return (
		<Box
			sx={{
				display: "flex",
				gap: "15px 10%",
				flexWrap: "wrap",
				justifyContent: "center",
			}}
		>
			<div style={{ display: "flex", gap: "10px" }}>
				<Typography variant="body2">Dirección:</Typography>
				<Typography variant="body2" color="text.secondary">
					{event.address}
				</Typography>
			</div>
			<div style={{ display: "flex", gap: "10px" }}>
				<Typography variant="body2">Fecha de inicio:</Typography>

				<Typography variant="body2" color="text.secondary">
					{event.start_date}
				</Typography>
			</div>
			<div style={{ display: "flex", gap: "10px" }}>
				<Typography variant="body2">Fecha de fin:</Typography>
				<Typography variant="body2" color="text.secondary">
					{event.end_date}
				</Typography>
			</div>
		</Box>
	);
}
