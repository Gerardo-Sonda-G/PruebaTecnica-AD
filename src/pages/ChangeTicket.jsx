import Box from "@mui/material/Box";
import { Card, CardContent, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useState, forwardRef } from "react";

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ChangeTicket() {
	const { register, handleSubmit } = useForm({});

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
		changeTicket(data)
			.then((resp) => {
				handleOpenAlert(
					"success",
					`El boleto con el numero ${resp.id} a sido cambiado correctamente`,
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
			<Box
				sx={{
					"& .MuiTextField-root": { m: 1, width: "25ch" },
				}}
			>
				<h1>Cambiar boleto</h1>

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
								type="number"
								id="outlined-basic"
								label="Numero de boleto"
								variant="outlined"
								{...register("id")}
							/>
							<TextField
								sx={{ minWidth: "40%" }}
								id="outlined-basic"
								label="Correo de compra"
								variant="outlined"
								{...register("email")}
							/>
							<div
								style={{
									width: "100%",
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Button variant="contained" size="large" type="submit">
									Obtener boleto
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

async function changeTicket(data) {
	const response = await fetch("/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `mutation {
				changeTicket(
					id:${data.id},
					email: "${data.email}"
				) {
				   id
				}
			  }`,
		}),
	});
	let json = await response.json();
	if (json.errors) {
		return Promise.reject(json.errors[0].message);
	}
	return json.data.changeTicket;
}
