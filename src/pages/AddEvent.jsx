import * as React from "react";
import Box from "@mui/material/Box";
import { Card, CardContent, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, Controller } from "react-hook-form";
import { useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function AddEvent() {
	const { register, handleSubmit, control } = useForm({
		defaultValues: {
			end_date: null,
			start_date: null,
		},
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
		await createEvent({
			...data,
			start_date: start_millis,
			end_date: end_millis,
		})
			.then((resp) => {
				handleOpenAlert(
					"success",
					`Evento creado correctamente con el nombre ${resp.name}`,
				);
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
			<h1>Crear nuevo evento</h1>
			<Box
				sx={{
					"& .MuiTextField-root": { m: 1, width: "25ch" },
				}}
			>
				<Card>
					<CardContent>
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
					</CardContent>
				</Card>
			</Box>
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

async function createEvent(data) {
	const response = await fetch("/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `mutation {
				createEvent(
				  input: {
					name:"${data.name}",
					type:"${data.type}",
					amount: ${data.amount},
					start_date: "${data.start_date}",
					end_date:"${data.end_date}",
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
		Promise.reject(json.errors[0].message);
	}
	return json.data.createEvent;
}
