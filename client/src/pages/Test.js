import React from "react";
import hasToken from "../methods/hasToken";
import { Navbar, TestTr } from "../components/componentIndex";

function Test() {
	const [user, setUser] = React.useState({});
	React.useLayoutEffect(() => {
		setUser(hasToken());
	}, []);
	const decideRender = () => {
		if (user.role === "teacher") {
			return (
				<>
					<Navbar signIn={!user.ok} />
					<TestTr user={user} />
				</>
			);
		} else if (user.role === "student") {
			return <h1>Hi user.name</h1>;
		} else {
			return <h1>Something went wrong</h1>;
		}
	};
	return decideRender();
}

export default Test;
