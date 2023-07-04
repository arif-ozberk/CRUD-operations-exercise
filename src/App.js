import React, { useEffect, useState } from 'react';
import './App.css';


function App() {

	const URL = "http://localhost:3500/users";

	const [userData, setUserData] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);
	const [isLoading, setIsLoading] = useState(true);


	// FETCHING THE INITIAL DATA FUNCTION
	const fetchData = async () => {
		try {
			const response = await fetch(URL);
			if(!response.ok) throw Error("Data did not received!");
			const data = await response.json();
			setUserData(data);
			setErrorMsg(null);
		}
		catch(error) {
			setErrorMsg(error.message);
		}
		finally {
			setIsLoading(false);
		}
	}


	useEffect(() => {
		setTimeout(() => {
			fetchData();
		}, 1000)
	}, []);


	// REFRESH BUTTON FUNCTION
	const refreshUsers = () => {
		setIsLoading(true);
		setTimeout(() => {
			fetchData();
		}, 1000);
	}


	// API REQUEST FUNCTION FOR CRUD OPERATIONS
	const apiRequest = async (url = '', optionsObj = null, errorMsg = null) => {
		try {
			const response = await fetch(url, optionsObj);
			if (!response.ok) throw Error("Please reaload the app!");
		}
		catch(error) {
			errorMsg = error.message;
		}
		finally {
			return errorMsg;
		}
	}


	const [nameInput, setNameInput] = useState("");
	const [ageInput, setAgeInput] = useState("");
	const [jobInput, setJobInput] = useState("");


	const nameInputHandler = (event) => {
		setNameInput(event.target.value);
	}


	const ageInputHandler = (event) => {
		setAgeInput(event.target.value);
	}


	const jobInputHandler = (event) => {
		setJobInput(event.target.value);
	}


	// ADD USER FUNCTION WITH POST REQUEST
	const handleAddUser = async () => {
		// const userId = userData.length ? userData.length + 1 : 1;
		const userId = Math.random() * 1000;
		if(!nameInput.length || !ageInput.length || !jobInput.length) {
			window.alert("Don't leave empty spaces!");
			return
		}
		const userName = nameInput;
		const userAge = Number(ageInput);
		const userJob = jobInput;
		
		const newUserInfo = {
			id: userId,
			name: userName,
			age: userAge,
			job: userJob
		}

		setUserData(prev => [...prev, newUserInfo]);

		const postOptions = {
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(newUserInfo)
		}

		const result = await apiRequest(URL, postOptions);
		if(result) setErrorMsg(result);

		setNameInput("");
		setAgeInput("");
		setJobInput("");
	}


	// DELETE USER FUNCTION WITH DELETE REQUEST
	const handleDeletUser = async (userId) => {
		const filteredList = userData.filter((item) => item.id !== userId);
		setUserData(filteredList);

		const deleteOptions = { method: 'DELETE' };
		const reqURL = `${URL}/${userId}`;
		const response = await apiRequest(reqURL, deleteOptions);
		if(response) setErrorMsg(response);
	}



	return (
		<div className="App">
			<div className="control-panel">
				<label>Name:</label>
				<input onChange={nameInputHandler} value={nameInput} type="text" style={{ margin: "1rem 0" }} /> <br />
				<label>Age:</label>
				<input onChange={ageInputHandler} value={ageInput} type="number" style={{ marginBottom: "1rem" }} /> <br />
				<label>Job:</label>
				<input onChange={jobInputHandler} value={jobInput} type="text" /> <br />
				<button onClick={handleAddUser} style={{ width: "5rem", height: "2rem", marginTop: "2rem" }}>Add</button>
			</div>


			<div style={{ marginTop: "5rem", position: "relative" }}>
				<button onClick={refreshUsers} style={{ position: "absolute", right: "2rem" }}>Refresh</button>
				<h1>Users</h1>
				<hr />

				{
					isLoading && 
					<div className="dot-spinner">
						<div className="dot-spinner__dot"></div>
						<div className="dot-spinner__dot"></div>
						<div className="dot-spinner__dot"></div>
						<div className="dot-spinner__dot"></div>
						<div className="dot-spinner__dot"></div>
						<div className="dot-spinner__dot"></div>
						<div className="dot-spinner__dot"></div>
						<div className="dot-spinner__dot"></div>
					</div>
				}

				{errorMsg && <p style={{ color: "red", fontSize: "1.3rem", "fontWeight": "bold" }}>{errorMsg}</p>}

				{
					userData.length ? 
				
					(!isLoading && !errorMsg && userData.map((item) => (
						<div key={item.id} style={{ position: "relative" }}>
							<h2>{item.name}</h2>
							<p>{item.age}</p>
							<p>{item.job}</p>
							<button 
								style={{ position: "absolute", right: "20px", top: "10px", fontSize: "2rem" }}
								onClick={() => handleDeletUser(item.id)}
							>X</button>
							<hr />
						</div>
					))) : !isLoading && (<p>Your user list is empty!</p>)
				}
			</div>

		</div>
	);
}

export default App;
