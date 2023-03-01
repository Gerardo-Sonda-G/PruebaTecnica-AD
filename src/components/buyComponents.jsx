import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

function Buy({ event }) {
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
				<Typography variant="body2">Fin de venta:</Typography>
				<Typography variant="body2" color="text.secondary">
					{event.end_date}
				</Typography>
			</div>
			<div style={{ display: "flex", gap: "10px" }}>
				<Typography variant="body2">Boletos disponibles:</Typography>
				<Typography variant="body2" color="text.secondary">
					{event.tickets_number === undefined
						? ""
						: event.tickets_number - event.sold_tickets}
				</Typography>
			</div>
			<div style={{ display: "flex", gap: "10px" }}>
				<Typography variant="body2">Tipo de evento:</Typography>

				<Typography variant="body2" color="text.secondary">
					{event.type}
				</Typography>
			</div>
		</Box>
	);
}

function BuyHeader({ event, handleModal }) {
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
					{event.name}
				</Typography>
				{buyButton({ event, handleModal })}
			</div>
		</>
	);
}

function buyButton({ event, handleModal }) {
	const active = event.tickets_number - event.sold_tickets;
	const end_millis = dayjs(event.end_date).unix();
	const dateNow = dayjs().unix();
	if (active === 0 || end_millis < dateNow) {
		return (
			<Button variant="contained" disabled={true} size="medium">
				Compra no disponible
			</Button>
		);
	} else {
		return (
			<Button
				variant="contained"
				onClick={() => {
					handleModal(event.id);
				}}
				disabled={
					event.tickets_number - event.sold_tickets === 0 ? true : false
				}
				size="medium"
			>
				Comprar boleto
			</Button>
		);
	}
}

export { BuyHeader, Buy };
