import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import EventIcon from "@mui/icons-material/Event";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import { Link } from "react-router-dom";

export const mainListItems = (
	<>
		<Link to={"/"} style={{ textDecoration: "none", color: "black" }}>
			<ListItemButton>
				<ListItemIcon>
					<EventIcon />
				</ListItemIcon>
				Eventos
			</ListItemButton>
		</Link>
		<Link to={"/buyTicket"} style={{ textDecoration: "none", color: "black" }}>
			<ListItemButton>
				<ListItemIcon>
					<ShoppingCartIcon />
				</ListItemIcon>
				Comprar boleto
			</ListItemButton>
		</Link>
		<Link
			to={"/changeTicket"}
			style={{ textDecoration: "none", color: "black" }}
		>
			<ListItemButton>
				<ListItemIcon>
					<FeaturedPlayListIcon />
				</ListItemIcon>
				Cambiar boleto
			</ListItemButton>
		</Link>
	</>
);
