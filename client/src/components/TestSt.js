import React, { useState, useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useParams, Redirect } from "react-router-dom";
import Countdown from "react-countdown";
import "./TestSt.css";
import "./TestTr.css";
import to12hrFormat from "../methods/to12hrFormat";
function TestSt() {
	const [courseCode, setCourseCode] = useState(useParams().code);
	const [testCode, setTestCode] = useState(useParams().test);
	const [test, setTest] = useState(null);

	useEffect(() => {
		console.log("in Effect");
		fetch(
			`${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testCode}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
				},
			}
		)
			.then((data, err) => {
				if (data) return data.json();
				else console.log(err);
			})
			.then((data) => {
				console.log(data);
				if (data.ok) {
					console.log(data);
					setTest(data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<>
			{test ? (
				test.ok ? (
					test.attempted ? (
						<Redirect to={`/c/${courseCode}/${testCode}/result`} />
					) : test.isStarted ? (
						<Started test={test} courseCode={courseCode} testName={testCode} />
					) : (
						<NotStarted test={test} />
					)
				) : (
					"Some error occured"
				)
			) : (
				<div className="center-msg">Loading.... </div>
			)}
		</>
	);
}

const NotStarted = ({ test }) => {
	const [arrowClicked, setArrowClicked] = useState(false);
	const css = {
		transform: arrowClicked ? "rotate(90deg)" : "",
	};

	function handleArrowClick() {
		setArrowClicked(!arrowClicked);
	}
	return (
		<div className="not-started-container">
			<div className="hero-container">
				<div className="heading-sep heading">
					{test.test_name} - {test.course_name}
				</div>
			</div>

			<div className="main-container">
				<div className="main-info">
					<h1 style={{ textAlign: "center" }}>{test.course_name}</h1>
					<table className="table-info" style={{ width: "100%" }}>
						<tbody className="big-table-content">
							<tr>
								<th>Test Name</th>
								<td>{test.test_name}</td>
							</tr>
							<tr>
								<th>Test Type</th>
								<td>{test.test_type}</td>
							</tr>
							<tr>
								<th>Test started</th>
								<td>No</td>
							</tr>
							<tr>
								<th>Marks</th>
								<td>{test.total_marks}</td>
							</tr>
							<tr>
								<th>Scheduled on</th>
								<td>{test.test_start_date}</td>
							</tr>
							<tr>
								<th>Test start time</th>
								<td>{to12hrFormat(test.test_start_time)}</td>
							</tr>
							<tr>
								<th>Test duration </th>
								<td>
									{Math.floor(test.test_duration)} hr{" "}
									{(test.test_duration - Math.floor(test.test_duration)) * 60}{" "}
									mins
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="main-countdown quiz">
					<TestCountdown
						date={test.test_start_date}
						time={test.test_start_time}
						duration={test.test_duration}
					/>
				</div>
			</div>

			<div className="question-block">
				<AiOutlineArrowRight
					onClick={handleArrowClick}
					style={css}
					className="question-arrow"
				/>
				<h1>Rules</h1>
			</div>
			{arrowClicked ? (
				<div className="rules-block">
					<ul className="rules-list">
						<li>Don't Copy</li>
						<li>Don't Copy</li>
						<li>Don't Copy</li>
						<li>Don't Copy</li>
					</ul>
				</div>
			) : null}
		</div>
	);
};

const TestCountdown = ({ date, time, duration }) => {
	const decideRender = () => {
		const testDate = new Date(`${date}T${time}`);
		if (testDate.getTime() > Date.now()) {
			return <Countdown date={testDate} />;
		} else if (testDate.getTime() + duration * 60 * 60 * 1000 > Date.now()) {
			return <h1>Test Started</h1>;
		} else {
			return <h1>Test has ended</h1>;
		}
	};
	return (
		<div id="countdown-container">
			<span>Test will start in</span>
			{decideRender()}
		</div>
	);
};

const Started = ({ test, courseCode, testName }) => {
	const [result, setResult] = useState([]);
	function handleSubmit(e) {
		console.log(result);
		e.preventDefault();
		var bool = window.confirm("Do you want to really submit?");
		if (bool) {
			console.log("Submitted");
			fetch(
				`${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testName}/attempt`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `bearer ${JSON.parse(
							localStorage.getItem("token")
						)}`,
					},
					body: JSON.stringify(result),
				}
			)
				.then((data, err) => {
					if (data) return data.json();
					else console.log(err);
				})
				.then((data) => {
					console.log(data);
					if (data.ok) {
						window.alert("Test Attempt successful");
						window.location.replace(`${window.location.href}/result`);
					} else {
						window.alert("Error occured");
					}
				});
		} else {
			console.log("Not Submitted");
		}
	}
	return (
		<div className="started-block">
			<Countdown
				date={
					new Date(
						`${test.test_start_date}T${test.test_start_time}`
					).getTime() +
					test.test_duration * 60 * 60 * 1000
				}
			/>
			<form className="started-form" onSubmit={handleSubmit}>
				{test.quiz.map((question) => (
					<Question
						key={question.id}
						result={result}
						setResult={setResult}
						question={question}
					/>
				))}
				<div className="started-btn-block">
					<button className="started-btn" type="submit">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

const Question = ({ question, result, setResult }) => {
	return (
		<div className="question-student">
			<h1>
				{question.id}. {question.question}
			</h1>
			<ul className="question-ul">
				{question.options.map((option) => (
					<li key={option}>
						<input
							onChange={() => {
								const obj = result.filter(
									(res) => !res.hasOwnProperty(question.id)
								);

								setResult([...obj, { [question.id]: option }]);
								console.log(result);
							}}
							name={question.id}
							type="radio"
							value={option}
						/>
						<label htmlFor={question.id}>{option}</label>
					</li>
				))}
			</ul>
		</div>
	);
};
export default TestSt;
