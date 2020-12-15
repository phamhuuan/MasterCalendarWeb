const date = new Date();
const selectedDate = new Date();
let selectedTab = 0;
let isAdd = true;
let selectedIndex = 0;
let textAreaValue = '';
let selectedRadio = 0;
let selectedRadio2 = 0;
// let noteList = "{\"Mon Dec 14 2020\":[\"a\",\"b\",\"c\"]}";
let noteList, eventList;
try {
	noteList = localStorage.getItem('noteList');
	if (!noteList) {
		noteList = JSON.stringify({});
	}
} catch (error) {
	noteList = JSON.stringify({});
}
try {
	eventList = localStorage.getItem('eventList');
	if (!eventList) {
		eventList = JSON.stringify({});
	}
} catch (error) {
	eventList = JSON.stringify({});
}
const renderCalendar = () => {
	date.setDate(1);

	const monthDays = document.querySelector(".days");

	// lay ngay cuoi cua thang hien tai
	const lastDay = new Date(
		date.getFullYear(),
		date.getMonth() + 1,
		0
	).getDate();

	// lay ngay cuoi cua thang truoc
	const prevLastDay = new Date(
		date.getFullYear(),
		date.getMonth(),
		0
	).getDate();

	
	const firstDayIndex = date.getDay();
	
	const lastDayIndex = new Date(
		date.getFullYear(),
		date.getMonth() + 1,
		0
		).getDay();
		
	const nextDays = 7 - lastDayIndex - 1;

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	document.querySelector(".date h1").innerHTML = months[date.getMonth()] + ' ' + date.getFullYear();

	document.querySelector(".date p").innerHTML = selectedDate.toDateString();

	let days = "";
	let month = date.getMonth();
	let year = date.getFullYear();
	let currentDate;
	for (let x = firstDayIndex; x > 0; x--) {
		if (month === 0) {
			currentDate = new Date(year - 1, 11, prevLastDay - x + 1).getTime();
		} else {
			currentDate = new Date(year, month - 1, prevLastDay - x + 1).getTime();
		}
		days += `<div onclick={setSelectDate(${currentDate})} class="prev-date">
			${prevLastDay - x + 1}
		</div>`;
	}
	for (let i = 1; i <= lastDay; i++) {
		currentDate = new Date(year, month, i).getTime();
		if (
			i === new Date().getDate() &&
			month === new Date().getMonth() &&
			year === new Date().getFullYear()
		) {
			days += `<div ondblclick={handleDoubleClick(${currentDate})} onclick={setSelectDate(${currentDate})} class="today">
				${i}
			</div>`;
		} else {
			let noteList2 = JSON.parse(noteList);
			let eventList2 = JSON.parse(eventList);
			let hasNote = false;
			let thisDay = new Date(year, month, i);
			if (noteList2[thisDay.toDateString()]) {
				hasNote = true;
			} else if (eventList2['D' + thisDay.getDay()]) {
				hasNote = true;
			} else if (eventList2[thisDay.getDate()] && eventList2[thisDay.getDate()][-1]) {
				hasNote = true;
			} else if (eventList2[thisDay.getDate()] && eventList2[thisDay.getDate()][thisDay.getMonth()] && eventList2[thisDay.getDate()][thisDay.getMonth()][-1]) {
				hasNote = true;
			} else if (eventList2[thisDay.getDate()] && eventList2[thisDay.getDate()][thisDay.getMonth()] && eventList2[thisDay.getDate()][thisDay.getMonth()][thisDay.getFullYear()]) {
				hasNote = true;
			}
			if (
				i === selectedDate.getDate() &&
				month === selectedDate.getMonth() &&
				year === selectedDate.getFullYear()
			) {
				days += `<div ondblclick={handleDoubleClick(${currentDate})} onclick={setSelectDate(${currentDate})} class="otherDay selectedDay">
					${i}
					${hasNote ? '<div id="dot2"></div>' : ''}
				</div>`;
			} else {
				days += `<div ondblclick={handleDoubleClick(${currentDate})} onclick={setSelectDate(${currentDate})} class="otherDay">
					${i}
					${hasNote ? '<div id="dot"></div>' : ''}
				</div>`;
			}
		}
	}

	for (let j = 1; j <= nextDays; j++) {
		if (month === 11) {
			currentDate = new Date(year + 1, 0, j).getTime();
		} else {
			currentDate = new Date(year, month + 1, j).getTime();
		}
		days += `<div onclick={setSelectDate(${currentDate})} class="next-date">${j}</div>`;
	}
	monthDays.innerHTML = days;
};

const renderNoteView = () => {
	const noteEvent = document.querySelector(".note_event");
	let noteView = '';
	noteView += `
		<div class="tabBar">
			<div onclick={setSelectedTab(${0})} class="tab ${selectedTab === 0 ? 'tabSelected': ''}">
				<p class="tabTitle">Note</p>
			</div>
			<div onclick={setSelectedTab(${1})} class="tab ${selectedTab === 1 ? 'tabSelected': ''}">
				<p class="tabTitle">Event</p>
			</div>
		</div>
	`;
	if (selectedTab === 0) {
		let noteList2 = JSON.parse(noteList);
		noteView += `<div class="noteList">`;
		if (noteList2 && noteList2[selectedDate.toDateString()]) {
			noteList2[selectedDate.toDateString()].forEach((item, index) => {
				noteView += `<div class="noteEventItem">
					<div class="noteEventIcon"></div>
					<p class="noteEventText">${item.split('\n').join('<br>')}</p>
					<div class="noteEventControlView">
						<div class="noteEventControlButton" onclick={editNote(${index})}>Edit</div>
						<div class="noteEventControlButton" onclick={deleteNote(${index})}>Delete</div>
					</div>
				</div>`;
			});
		} else {
			noteView += `<div class="noNoteView">You don't have any note</div>`
		}
		noteView += `</div>`;
		if (isAdd) {
			noteView += `<div class="addView">
				<textarea class="addTextArea" id="addNoteArea">${textAreaValue}</textarea>
				<div class="controlView">
					<div class="button" onclick={addNote()}>Add</div>
				</div>
			</div>`;
		} else {
			noteView += `<div class="addView">
				<textarea class="addTextArea" id="addNoteArea"></textarea>
				<div class="controlView">
					<div class="button" onclick={saveNote()}>Save</div>
					<div class="button" onclick={cancelEdit()}>Cancel</div>
				</div>
			</div>`;
		}
	}
	if (selectedTab === 1) {
		let eventList2 = JSON.parse(eventList);
		noteView += `<div class="noteList">`;
		if (eventList !== '{}') {
			// hien thi event lap lai theo nam
			if (eventList2[selectedDate.getDate()] && eventList2[selectedDate.getDate()][selectedDate.getMonth()] && eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1]) {
				eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1].forEach((item, index) => {
					noteView += `<div class="noteEventItem">
						<div class="noteEventIcon"></div>
						<p class="noteEventText">${item.split('\n').join('<br>')}</p>
						<div class="noteEventControlView">
							<div class="noteEventControlButton" onclick={editEvent(${index},${3})}>Edit</div>
							<div class="noteEventControlButton" onclick={deleteEvent(${index},${3})}>Delete</div>
						</div>
					</div>`;
				});
			}
			// hien thi event lap lai theo thang
			if (eventList2[selectedDate.getDate()] && eventList2[selectedDate.getDate()][-1]) {
				eventList2[selectedDate.getDate()][-1].forEach((item, index) => {
					noteView += `<div class="noteEventItem">
						<div class="noteEventIcon"></div>
						<p class="noteEventText">${item.split('\n').join('<br>')}</p>
						<div class="noteEventControlView">
							<div class="noteEventControlButton" onclick={editEvent(${index},${2})}>Edit</div>
							<div class="noteEventControlButton" onclick={deleteEvent(${index},${2})}>Delete</div>
						</div>
					</div>`;
				});
			}
			// hien thi event lap lai theo thu
			if (eventList2['D' + selectedDate.getDay()]) {
				eventList2['D' + selectedDate.getDay()].forEach((item, index) => {
					noteView += `<div class="noteEventItem">
						<div class="noteEventIcon"></div>
						<p class="noteEventText">${item.split('\n').join('<br>')}</p>
						<div class="noteEventControlView">
							<div class="noteEventControlButton" onclick={editEvent(${index},${1})}>Edit</div>
							<div class="noteEventControlButton" onclick={deleteEvent(${index},${1})}>Delete</div>
						</div>
					</div>`;
				});
			}
			// hien thi event khong lap lai
			if (eventList2[selectedDate.getDate()] && eventList2[selectedDate.getDate()][selectedDate.getMonth()] && eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()]) {
				eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()].forEach((item, index) => {
					noteView += `<div class="noteEventItem">
						<div class="noteEventIcon"></div>
						<p class="noteEventText">${item.split('\n').join('<br>')}</p>
						<div class="noteEventControlView">
							<div class="noteEventControlButton" onclick={editEvent(${index},${0})}>Edit</div>
							<div class="noteEventControlButton" onclick={deleteEvent(${index},${0})}>Delete</div>
						</div>
					</div>`;
				});
			}
		} else {
			noteView += `<div class="noNoteView">You don't have any event</div>`
		}
		noteView += `</div>`;
		noteView += `<div class="radio">
			<label class="radioContainer" onclick={setType(0)}>No repeat
				<input type="radio" ${selectedRadio === 0 ? 'checked="checked"' : ""}" name="radio">
				<span class="checkmark"></span>
			</label>
			<label class="radioContainer" onclick={setType(1)}>Every week
				<input type="radio" ${selectedRadio === 1 ? 'checked="checked"' : ""}" name="radio">
				<span class="checkmark"></span>
			</label>
			<label class="radioContainer" onclick={setType(2)}>Every month
				<input type="radio" ${selectedRadio === 2 ? 'checked="checked"' : ""}" name="radio">
				<span class="checkmark"></span>
			</label>
			<label class="radioContainer" onclick={setType(3)}>Every year
				<input type="radio" ${selectedRadio === 3 ? 'checked="checked"' : ""}" name="radio">
				<span class="checkmark"></span>
			</label>	
		</div>`;
		if (isAdd) {
			noteView += `<div class="addView">
				<textarea class="addTextArea" id="addNoteArea">${textAreaValue}</textarea>
				<div class="controlView">
					<div class="button" onclick={addEvent()}>Add</div>
				</div>
			</div>`;
		} else {
			noteView += `<div class="addView">
				<textarea class="addTextArea" id="addNoteArea"></textarea>
				<div class="controlView">
					<div class="button" onclick={saveEvent()}>Save</div>
					<div class="button" onclick={cancelEdit()}>Cancel</div>
				</div>
			</div>`;
		}
	}
	noteEvent.innerHTML = noteView;
	document.getElementById('addNoteArea').value = textAreaValue;
};

document.querySelector(".prev").addEventListener("click", () => {
	if (date.getMonth() === 0) {
		date.setMonth(11);
		date.setFullYear(date.getFullYear() - 1);
	} else {
		date.setMonth(date.getMonth() - 1);
	}
	renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
	if (date.getMonth() === 11) {
		date.setMonth(0);
		date.setFullYear(date.getFullYear() + 1);
	} else {
		date.setMonth(date.getMonth() + 1);
	}
	renderCalendar();
});

let tempDate;

document.addEventListener("keydown", (e) => {
	if (!['input', 'textarea'].includes(e.target.nodeName.toLowerCase())) {
		switch (e.code) {
			case "ArrowUp":
				setSelectDate(selectedDate.getTime() - 7 * 86400 * 1000);
				break;
			case "ArrowDown":
				setSelectDate(selectedDate.getTime() + 7 * 86400 * 1000);
				break;
			case "ArrowLeft":
				setSelectDate(selectedDate.getTime() - 1 * 86400 * 1000);
				break;
			case "ArrowRight":
				setSelectDate(selectedDate.getTime() + 1 * 86400 * 1000);
				break;
			case "KeyA":
				tempDate = new Date(selectedDate);
				tempDate.setFullYear(tempDate.getFullYear() - 1);
				setSelectDate(tempDate.getTime());
				break;
			case "KeyF":
				tempDate = new Date(selectedDate);
				tempDate.setFullYear(tempDate.getFullYear() + 1);
				setSelectDate(tempDate.getTime());
				break;
			case "KeyS":
				tempDate = new Date(selectedDate);
				if (tempDate.getMonth() === 0) {
					tempDate.setMonth(11);
					tempDate.setFullYear(tempDate.getFullYear() - 1);
				} else {
					tempDate.setMonth(tempDate.getMonth() - 1);
				}
				setSelectDate(tempDate.getTime());
				break;
			case "KeyD":
				tempDate = new Date(selectedDate);
				if (tempDate.getMonth() === 11) {
					tempDate.setMonth(0);
					tempDate.setFullYear(tempDate.getFullYear() + 1);
				} else {
					tempDate.setMonth(tempDate.getMonth() + 1);
				}
				setSelectDate(tempDate.getTime());
				break;
			case "KeyN":
				document.getElementById('note_event').style.display = 'flex';
				selectedTab = 0;
				renderNoteView();
				break;
			case "KeyE":
				document.getElementById('note_event').style.display = 'flex';
				selectedTab = 1;
				renderNoteView();
				break;
			case "Enter":
				document.getElementById('note_event').style.display = 'flex';
				break;
			case "Escape":
				document.getElementById('note_event').style.display = 'none';
				break;
			case "Tab":
				if (document.getElementById('note_event').style.display === 'flex') {
					document.getElementById('addNoteArea').focus();
				}
			default:
				break;
		}
	} else {
		switch (e.code) {
			case "Escape":
				document.getElementById('addNoteArea').blur();
				break;
		
			default:
				break;
		}
	}
});

const setSelectDate = (newDate) => {
	newDate = new Date(newDate);
	textAreaValue = '';
	isAdd = true;
	selectedDate.setDate(newDate.getDate());
	selectedDate.setMonth(newDate.getMonth());
	date.setMonth(newDate.getMonth());
	selectedDate.setFullYear(newDate.getFullYear());
	date.setFullYear(newDate.getFullYear());
	selectedRadio = 0;
	renderCalendar();
	renderNoteView();
}

const handleDoubleClick = (newDate) => {
	document.getElementById('note_event').style.display = 'flex';
	selectedDate(newDate);
}

const setSelectedTab = (tab) => {
	selectedTab = tab;
	renderNoteView();
}

const setType = (number) => {
	selectedRadio = number;
}

const addNote = () => {
	const noteArea = document.getElementById('addNoteArea');
	if (noteArea.value.trim() !== '') {
		let noteList2 = JSON.parse(noteList);
		if (noteList2[selectedDate.toDateString()] === undefined) {
			noteList2[selectedDate.toDateString()] = [noteArea.value.trim()];
		} else {
			noteList2[selectedDate.toDateString()].push(noteArea.value.trim());
		}
		noteList = JSON.stringify(noteList2);
		noteArea.value = '';
		try {
			localStorage.setItem('noteList', noteList);
		} catch (error) {}
		renderNoteView();
		renderCalendar();
	}
};

const addEvent = (notRender) => {
	const eventArea = document.getElementById('addNoteArea');
	if (eventArea.value.trim() !== '') {
		let eventList2 = JSON.parse(eventList);
		if (selectedRadio === 0) {
			if (eventList2[selectedDate.getDate()]) {
				if (eventList2[selectedDate.getDate()][selectedDate.getMonth()]) {
					if (eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()]) {
						eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()].push(eventArea.value.trim());
					} else {
						eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()] = [eventArea.value.trim()];
					}
				} else {
					eventList2[selectedDate.getDate()][selectedDate.getMonth()] = {};
					eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()] = [eventArea.value.trim()];
				}
			} else {
				eventList2[selectedDate.getDate()] = {};
				eventList2[selectedDate.getDate()][selectedDate.getMonth()] = {};
				eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()] = [eventArea.value.trim()];
			}
		} else if (selectedRadio === 1) {
			if (eventList2['D' + selectedDate.getDay()]) {
				eventList2['D' + selectedDate.getDay()].push(eventArea.value.trim());
			} else {
				eventList2['D' + selectedDate.getDay()] = [eventArea.value.trim()];
			}
		} else if (selectedRadio === 2) {
			if (eventList2[selectedDate.getDate()]) {
				if (eventList2[selectedDate.getDate()][-1]) {
					eventList2[selectedDate.getDate()][-1].push(eventArea.value.trim());
				} else {
					eventList2[selectedDate.getDate()][-1] = [eventArea.value.trim()];
				}
			} else {
				eventList2[selectedDate.getDate()] = {};
				eventList2[selectedDate.getDate()][-1] = [eventArea.value.trim()];
			}
		} else if (selectedRadio === 3) {
			if (eventList2[selectedDate.getDate()]) {
				if (eventList2[selectedDate.getDate()][selectedDate.getMonth()]) {
					if (eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1]) {
						eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1].push(eventArea.value.trim());
					} else {
						eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1] = [eventArea.value.trim()];
					}
				} else {
					eventList2[selectedDate.getDate()][selectedDate.getMonth()] = {};
					eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1] = [eventArea.value.trim()];
				}
			} else {
				eventList2[selectedDate.getDate()] = {};
				eventList2[selectedDate.getDate()][selectedDate.getMonth()] = {};
				eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1] = [eventArea.value.trim()];
			}
		}
		eventList = JSON.stringify(eventList2);
		eventArea.value = '';
		try {
			localStorage.setItem('eventList', eventList);
		} catch (error) {}
		if (notRender === true) {
		} else {
			renderNoteView();
			renderCalendar();
		}
	}
}

const editNote = (index) => {
	let noteList2 = JSON.parse(noteList);
	textAreaValue = noteList2[selectedDate.toDateString()][index];
	isAdd = false;
	selectedIndex = index;
	renderNoteView();
};

const editEvent = (index, type) => {
	let eventList2 = JSON.parse(eventList);
	if (type === 0) {
		textAreaValue = eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()][index];
	} else if (type === 1) {
		textAreaValue = eventList2['D' + selectedDate.getDay()][index];
	} else if (type === 2) {
		textAreaValue = eventList2[selectedDate.getDate()][-1][index];
	} else if (type === 3) {
		textAreaValue = eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1][index];
	}
	selectedIndex = index;
	selectedRadio = type;
	selectedRadio2 = type;
	isAdd = false;
	renderNoteView();
	renderCalendar();
}

const saveNote = () => {
	const noteArea = document.getElementById('addNoteArea');
	if (noteArea.value.trim() !== '') {
		let noteList2 = JSON.parse(noteList);
		noteList2[selectedDate.toDateString()][selectedIndex] = noteArea.value.trim();
		noteList = JSON.stringify(noteList2);
		isAdd = true;
		noteArea.value = '';
		textAreaValue = '';
		try {
			localStorage.setItem('noteList', noteList);
		} catch (error) {}
		renderNoteView();
	}
};

const saveEvent = () => {
	const eventArea = document.getElementById('addNoteArea');
	if (eventArea.value.trim() !== '') {
		let eventList2 = JSON.parse(eventList);
		if (selectedRadio === selectedRadio2) {
			if (selectedRadio === 0) {
				eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()][selectedIndex] = eventArea.value.trim();
			} else if (selectedRadio === 1) {
				eventList2['D' + selectedDate.getDay()][selectedIndex] = eventArea.value.trim();
			} else if (selectedRadio === 2) {
				eventList2[selectedDate.getDate()][-1][selectedIndex] = eventArea.value.trim();
			} else if (selectedRadio === 3) {
				eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1][selectedIndex] = eventArea.value.trim();
			}
			eventList = JSON.stringify(eventList2);
		} else {
			eventList = JSON.stringify(eventList2);
			deleteEvent(selectedIndex, selectedRadio2, true);
			addEvent(true);
		}
		eventArea.value = '';
		textAreaValue = '';
		isAdd = true;
		try {
			localStorage.setItem('eventList', eventList);
		} catch (error) {}
		renderNoteView();
	}
};

const deleteNote = (index) => {
	let noteList2 = JSON.parse(noteList);
	if (noteList2[selectedDate.toDateString()].length === 1) {
		delete noteList2[selectedDate.toDateString()];
	} else {
		noteList2[selectedDate.toDateString()].splice(index, 1);
	}
	noteList = JSON.stringify(noteList2);
	isAdd = true;
	try {
		localStorage.setItem('noteList', noteList);
	} catch (error) {}
	renderNoteView();
	renderCalendar();
};

const deleteEvent = (index, type, notRender) => {
	let eventList2 = JSON.parse(eventList);
	if (type === 0) {
		if (eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()].length === 1) {
			delete eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()];
			if (JSON.stringify(eventList2[selectedDate.getDate()][selectedDate.getMonth()]) === '{}') {
				delete eventList2[selectedDate.getDate()][selectedDate.getMonth()];
				if (JSON.stringify(eventList2[selectedDate.getDate()]) === '{}') {
					delete eventList2[selectedDate.getDate()];
				}
			}
		} else {
			eventList2[selectedDate.getDate()][selectedDate.getMonth()][selectedDate.getFullYear()].splice(index, 1);
		}
	} else if (type === 1) {
		if (eventList2['D' + selectedDate.getDay()].length === 1) {
			delete eventList2['D' + selectedDate.getDay()];
		} else {
			eventList2['D' + selectedDate.getDay()].splice(index, 1);
		}
	} else if (type === 2) {
		if (eventList2[selectedDate.getDate()][-1].length === 1) {
			delete eventList2[selectedDate.getDate()][-1];
			if (JSON.stringify(eventList2[selectedDate.getDate()]) === '{}') {
				delete eventList2[selectedDate.getDate()];
			}
		} else {
			eventList2[selectedDate.getDate()][-1].splice(index, 1);
		}
	} else if (type === 3) {
		if (eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1].length === 1) {
			delete eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1];
			if (JSON.stringify(eventList2[selectedDate.getDate()][selectedDate.getMonth()]) === '{}') {
				delete eventList2[selectedDate.getDate()][selectedDate.getMonth()];
				if (JSON.stringify(eventList2[selectedDate.getDate()]) === '{}') {
					delete eventList2[selectedDate.getDate()];
				}
			}
		} else {
			eventList2[selectedDate.getDate()][selectedDate.getMonth()][-1].splice(index, 1);
		}
	}
	isAdd = true;
	eventList = JSON.stringify(eventList2);
	try {
		localStorage.setItem('eventList', eventList);
	} catch (error) {}
	if (notRender === true) {
	} else {
		renderNoteView();
		renderCalendar();
	}
}

const cancelEdit = () => {
	const noteArea = document.getElementById('addNoteArea');
	isAdd = true;
	noteArea.value = '';
	textAreaValue = '';
	renderNoteView();
}

renderCalendar();
renderNoteView();