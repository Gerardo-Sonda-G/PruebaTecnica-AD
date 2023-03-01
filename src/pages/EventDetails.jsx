import { useEffect, useState, forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/system";
import Modal from "@mui/material/Modal";
import { useForm, Controller } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const event2 = {
	id: 0,
	name: "",
	address: "",
	amount: 0,
	start_date: "",
	end_date: "",
	tickets_number: 0,
	sold_tickets: 0,
	changed_tickets: 0,
	type: "",
};

export default function EventDetails() {
	let { id } = useParams();
	const [event, setEvent] = useState({ ...event2 });
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const { register, handleSubmit, reset, control } = useForm({
		defaultValues: { ...event2 },
	});

	const [alertInfo, setAlertInfo] = useState({
		open: false,
		severity: "success",
		message: "Evento correctamente",
	});

	const handleOpenAlert = (severity, message) => {
		setAlertInfo({ open: true, severity: severity, message: message });
	};

	const handleCloseAlert = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setAlertInfo({ open: false });
	};
	const onSubmit = async (data) => {
		let start_millis = new Date(data.start_date).getTime();
		let end_millis = new Date(data.end_date).getTime();
		await updateEvent({
			...data,
			start_date: start_millis,
			end_date: end_millis,
		})
			.then((resp) => {
				handleOpenAlert(
					"success",
					`Evento con el nombre ${resp.name} actualizado correctamente`,
				);
				getEvent();
			})
			.catch((error) => {
				if (
					error.toString() ===
					"SyntaxError: JSON.parse: unexpected end of data at line 1 column 1 of the JSON data"
				) {
					handleOpenAlert("error", "Error con el servidor");
				} else {
					handleOpenAlert("error", error.toString());
				}
			});
	};

	const onDelete = async (data) => {
		await deleteEvent(data)
			.then(() => {
				handleOpenAlert("success", "Evento eliminado correctamente");
				navigate("/");
			})
			.catch((error) => {
				if (
					error.toString() ===
					"SyntaxError: JSON.parse: unexpected end of data at line 1 column 1 of the JSON data"
				) {
					handleOpenAlert("error", "Error con el servidor");
				} else {
					handleOpenAlert("error", error.toString());
				}
			});
	};

	const getEvent = async () => {
		let result = await queryEvent(id);
		setEvent(result);
		reset({ ...result, id: id });
	};

	useEffect(() => {
		getEvent();
	}, []);

	return (
		<>
			<h1>Detalles del evento</h1>
			<Card key={event.id} sx={{ width: "80%", marginBottom: "25px" }}>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{event.name}
					</Typography>

					<Box
						sx={{
							display: "flex",
							gap: "15px 10%",
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
						<div style={{ display: "flex", gap: "10px" }}>
							<Typography variant="body2">Tipo de evento:</Typography>
							<Typography variant="body2" color="text.secondary">
								{event.changed_tickets}
							</Typography>
						</div>
						<div style={{ display: "flex", gap: "10px" }}>
							<Typography variant="body2">Dirección:</Typography>
							<Typography variant="body2" color="text.secondary">
								{event.address}
							</Typography>
						</div>
						<div style={{ display: "flex", gap: "10px" }}>
							<Typography variant="body2">Costo:</Typography>
							<Typography variant="body2" color="text.secondary">
								{event.amount}
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

						<div style={{ display: "flex", gap: "10px" }}>
							<Typography variant="body2">Boletos vendidos</Typography>
							<Typography variant="body2" color="text.secondary">
								{event.sold_tickets}
							</Typography>
						</div>
						<div style={{ display: "flex", gap: "10px" }}>
							<Typography variant="body2">Boletos cambiados:</Typography>
							<Typography variant="body2" color="text.secondary">
								{event.changed_tickets}
							</Typography>
						</div>

						<div style={{ display: "flex", gap: "10px" }}>
							<Typography variant="body2">Boletos restantes:</Typography>
							<Typography variant="body2" color="text.secondary">
								{event.tickets_number - event.sold_tickets}
							</Typography>
						</div>
					</Box>
				</CardContent>
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button variant="contained" size="small" onClick={handleOpen}>
						Editar
					</Button>
					<Button
						variant="contained"
						size="small"
						onClick={() => {
							onDelete({ id: event.id });
						}}
					>
						Eliminar
					</Button>
				</CardActions>
			</Card>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<h1 style={{ textAlign: "center", marginTop: "0" }}>
						Actualizar evento
					</h1>
					<form
						noValidate
						autoComplete="off"
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "20px",
							justifyContent: "center",
						}}
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextField
							sx={{ minWidth: "40%" }}
							id="outlined-basic"
							label="Nombre del evento"
							variant="outlined"
							{...register("name")}
						/>
						<TextField
							sx={{ minWidth: "40%" }}
							id="outlined-basic"
							label="Tipo de evento"
							variant="outlined"
							{...register("type")}
						/>
						<Controller
							name="start_date"
							control={control}
							render={({ field }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										views={["day"]}
										label="Fecha de inicio"
										{...field}
										renderInput={(params) => (
											<TextField
												sx={{ minWidth: "40%" }}
												{...params}
												helperText={null}
											/>
										)}
									/>
								</LocalizationProvider>
							)}
						/>
						<Controller
							name="end_date"
							control={control}
							render={({ field }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										views={["day"]}
										label="Fecha de fin"
										{...field}
										renderInput={(params) => (
											<TextField
												sx={{ minWidth: "40%" }}
												{...params}
												helperText={null}
											/>
										)}
									/>
								</LocalizationProvider>
							)}
						/>
						<TextField
							sx={{ minWidth: "40%" }}
							id="outlined-basic"
							label="Costo"
							variant="outlined"
							{...register("amount")}
							type="number"
						/>
						<TextField
							sx={{ minWidth: "40%" }}
							id="outlined-basic"
							label="Numero de boletos"
							variant="outlined"
							{...register("tickets_number")}
							type="number"
						/>
						<TextField
							sx={{ minWidth: "40%" }}
							id="outlined-basic"
							label="Dirección"
							variant="outlined"
							{...register("address")}
						/>
						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Button variant="contained" size="large" type="submit">
								Guardar
							</Button>
						</div>
					</form>
				</Box>
			</Modal>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				open={alertInfo.open}
				autoHideDuration={6000}
				onClose={handleCloseAlert}
			>
				<Alert
					onClose={handleCloseAlert}
					severity={alertInfo.severity}
					sx={{ width: "100%" }}
				>
					{alertInfo.message}
				</Alert>
			</Snackbar>
		</>
	);
}

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 600,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
async function queryEvent(id) {
	const response = await fetch("/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `query{
				getEvent(id:${id}){
					id,
					name,
					start_date,
					end_date,
					tickets_number,
					changed_tickets,
					sold_tickets,
					type,
					amount,
					address
				  }
			}`,
		}),
	});
	let events = await response.json();
	return events.data.getEvent;
}

async function updateEvent(data) {
	const response = await fetch("/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `mutation {
				updateEvent(
				  input: {
					id:${data.id},
					name:"${data.name}",
					type:"${data.type}",
					amount: ${data.amount},
					start_date: "${data.start_date}",
					end_date: "${data.end_date}",
					tickets_number: ${data.tickets_number},
					address:"${data.address}",
				  }
				) {
				  name
				}
			  }`,
		}),
	});
	let json = await response.json();
	if (json.errors) {
		return Promise.reject(json.errors[0].message);
	}
	return json.data.updateEvent;
}
async function deleteEvent(data) {
	const response = await fetch("/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `mutation {
				deleteEvent(
					id:${parseInt(data.id, 10)},
				) {
				  name
				}
			  }`,
		}),
	});
	let json = await response.json();
	if (json.errors) {
		return Promise.reject(json.errors[0].message);
	}
	return json.data.deleteEvent;
}
