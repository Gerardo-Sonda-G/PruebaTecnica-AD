import EventsList from "../components/eventsList";
import { useEffect, useState, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function BuyTickets() {
	const [events, setEvents] = useState([]);
	const [open, setOpen] = useState(false);
	const { errors, handleSubmit, reset, control } = useForm({
		defaultValues: {
			id: undefined,
			email: "",
			sold_tickets: 0,
			tickets_number: 0,
		},
	});

	useEffect(() => {
		const controller = new AbortController();
		queryEvents()
			.then((result) => {
				setEvents(result);
			})
			.catch(() => {});
		return () => {
			controller.abort();
		};
	}, []);

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

	const handleOpen = (id) => {
		setOpen(true);
		reset({ id: id, email: "" });
	};
	const handleClose = () => setOpen(false);

	const onSubmit = async (data) => {
		createTicket(data)
			.then((resp) => {
				handleOpenAlert(
					"success",
					`Compra exitosa el numero de boleto es: ${resp.id}`,
				);
				queryEvents()
					.then((result) => {
						setEvents(result);
					})
					.catch(() => {});
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
	return (
		<>
			<h1 style={{ width: "100%", textAlign: "center" }}>Eventos</h1>
			<EventsList type="buy" events={events} handleModal={handleOpen} />
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
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									sx={{ minWidth: "40%" }}
									id="outlined-basic"
									label="Correo de comprador"
									variant="outlined"
									{...field}
								/>
							)}
						/>
						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Button variant="contained" size="large" type="submit">
								Comprar
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
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

async function queryEvents() {
	const response = await fetch("/graphql", {
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
                    amount,
                    tickets_number, 
                    sold_tickets,
				  }
			}`,
		}),
	});
	let events = await response.json();
	return events.data.getEvents;
}

async function createTicket(data) {
	let now = dayjs();
	const response = await fetch("/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `mutation {
				createTicket(
				  input: {
					event_id:${data.id},
					email:"${data.email}",
					ticket_date:"${now.valueOf()}",
				  }
				) {
				  id
				}
			  }`,
		}),
	});
	let json = await response.json();
	if (json.errors) {
		Promise.reject(json.errors[0].message);
	}
	return json.data.createTicket;
}
