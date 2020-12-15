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
	let lunarDate;
	for (let x = firstDayIndex; x > 0; x--) {
		if (month === 0) {
			currentDate = new Date(year - 1, 11, prevLastDay - x + 1).getTime();
			lunarDate = convertSolar2Lunar(x, 12, year - 1, 0);
		} else {
			currentDate = new Date(year, month - 1, prevLastDay - x + 1).getTime();
			lunarDate = convertSolar2Lunar(x, month, year, 0);
		}
		days += `<div onclick={setSelectDate(${currentDate})} class="prev-date">
			${prevLastDay - x + 1}
			<span class="lunarDate">${lunarDate[0] === 1 ? lunarDate[0] + '/' + lunarDate[1] : lunarDate[0]}</span>
		</div>`;
	}
	for (let i = 1; i <= lastDay; i++) {
		currentDate = new Date(year, month, i).getTime();
		lunarDate = convertSolar2Lunar(i, month + 1, year, 0);
		if (
			i === new Date().getDate() &&
			month === new Date().getMonth() &&
			year === new Date().getFullYear()
		) {
			days += `<div ondblclick={handleDoubleClick(${currentDate})} onclick={setSelectDate(${currentDate})} class="today">
				${i}
				<span class="lunarDate">${lunarDate[0] === 1 ? lunarDate[0] + '/' + lunarDate[1] : lunarDate[0]}</span>
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
					${hasNote ? '<span class="dot"></span>' : ''}
					<span class="lunarDate">${lunarDate[0] === 1 ? lunarDate[0] + '/' + lunarDate[1] : lunarDate[0]}</span>
				</div>`;
			} else {
				days += `<div ondblclick={handleDoubleClick(${currentDate})} onclick={setSelectDate(${currentDate})} class="otherDay">
					${i}
					${hasNote ? '<span class="dot2"></span>' : ''}
					<span class="lunarDate2">${lunarDate[0] === 1 ? lunarDate[0] + '/' + lunarDate[1] : lunarDate[0]}</span>
				</div>`;
			}
		}
	}

	for (let j = 1; j <= nextDays; j++) {
		if (month === 11) {
			currentDate = new Date(year + 1, 0, j).getTime();
			lunarDate = convertSolar2Lunar(j, 1, year + 1, 0);
		} else {
			currentDate = new Date(year, month + 1, j).getTime();
			lunarDate = convertSolar2Lunar(j, month + 2, year, 0);
		}
		days += `<div onclick={setSelectDate(${currentDate})} class="next-date">
			${j}
			<span class="lunarDate2">${lunarDate[0] === 1 ? lunarDate[0] + '/' + lunarDate[1] : lunarDate[0]}</span>
		</div>`;
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
			case "Space":
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

var PI = Math.PI;

/* Discard the fractional part of a number, e.g., INT(3.2) = 3 */
function INT(d) {
	return Math.floor(d);
}

/* Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number 
 * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy. 
 * Formula from http://www.tondering.dk/claus/calendar.html
 */
function jdFromDate(dd, mm, yy) {
	var a, y, m, jd;
	a = INT((14 - mm) / 12);
	y = yy+4800-a;
	m = mm+12*a-3;
	jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - INT(y/100) + INT(y/400) - 32045;
	if (jd < 2299161) {
		jd = dd + INT((153*m+2)/5) + 365*y + INT(y/4) - 32083;
	}
	return jd;
}

/* Convert a Julian day number to day/month/year. Parameter jd is an integer */
function jdToDate(jd) {
	var a, b, c, d, e, m, day, month, year;
	if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
		a = jd + 32044;
		b = INT((4*a+3)/146097);
		c = a - INT((b*146097)/4);
	} else {
		b = 0;
		c = jd + 32082;
	}
	d = INT((4*c+3)/1461);
	e = c - INT((1461*d)/4);
	m = INT((5*e+2)/153);
	day = e - INT((153*m+2)/5) + 1;
	month = m + 3 - 12*INT(m/10);
	year = b*100 + d - 4800 + INT(m/10);
	return new Array(day, month, year);
}

/* Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT 
 * (measured as the number of days since 1/1/4713 BC noon UCT, e.g., 2451545.125 is 1/1/2000 15:00 UTC).
 * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
function NewMoon(k) {
	var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
	T = k/1236.85; // Time in Julian centuries from 1900 January 0.5
	T2 = T * T;
	T3 = T2 * T;
	dr = PI/180;
	Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
	Jd1 = Jd1 + 0.00033*Math.sin((166.56 + 132.87*T - 0.009173*T2)*dr); // Mean new moon
	M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3; // Sun's mean anomaly
	Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3; // Moon's mean anomaly
	F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3; // Moon's argument of latitude
	C1=(0.1734 - 0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
	C1 = C1 - 0.4068*Math.sin(Mpr*dr) + 0.0161*Math.sin(dr*2*Mpr);
	C1 = C1 - 0.0004*Math.sin(dr*3*Mpr);
	C1 = C1 + 0.0104*Math.sin(dr*2*F) - 0.0051*Math.sin(dr*(M+Mpr));
	C1 = C1 - 0.0074*Math.sin(dr*(M-Mpr)) + 0.0004*Math.sin(dr*(2*F+M));
	C1 = C1 - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mpr));
	C1 = C1 + 0.0010*Math.sin(dr*(2*F-Mpr)) + 0.0005*Math.sin(dr*(2*Mpr+M));
	if (T < -11) {
		deltat= 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3;
	} else {
		deltat= -0.000278 + 0.000265*T + 0.000262*T2;
	};
	JdNew = Jd1 + C1 - deltat;
	return JdNew;
}

/* Compute the longitude of the sun at any time. 
 * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
function SunLongitude(jdn) {
	var T, T2, dr, M, L0, DL, L;
	T = (jdn - 2451545.0 ) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
	T2 = T*T;
	dr = PI/180; // degree to radian
	M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
	L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
	DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
	DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
	L = L0 + DL; // true longitude, degree
	L = L*dr;
	L = L - PI*2*(INT(L/(PI*2))); // Normalize to (0, 2*PI)
	return L;
}

/* Compute sun position at midnight of the day with the given Julian day number. 
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
 * The function returns a number between 0 and 11. 
 * From the day after March equinox and the 1st major term after March equinox, 0 is returned. 
 * After that, return 1, 2, 3 ... 
 */
function getSunLongitude(dayNumber, timeZone) {
	return INT(SunLongitude(dayNumber - 0.5 - timeZone/24)/PI*6);
}

/* Compute the day of the k-th new moon in the given time zone.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
 */
function getNewMoonDay(k, timeZone) {
	return INT(NewMoon(k) + 0.5 + timeZone/24);
}

/* Find the day that starts the luner month 11 of the given year for the given time zone */
function getLunarMonth11(yy, timeZone) {
	var k, off, nm, sunLong;
	//off = jdFromDate(31, 12, yy) - 2415021.076998695;
	off = jdFromDate(31, 12, yy) - 2415021;
	k = INT(off / 29.530588853);
	nm = getNewMoonDay(k, timeZone);
	sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
	if (sunLong >= 9) {
		nm = getNewMoonDay(k-1, timeZone);
	}
	return nm;
}

/* Find the index of the leap month after the month starting on the day a11. */
function getLeapMonthOffset(a11, timeZone) {
	var k, last, arc, i;
	k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
	last = 0;
	i = 1; // We start with the month following lunar month 11
	arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
	do {
		last = arc;
		i++;
		arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
	} while (arc != last && i < 14);
	return i-1;
}

/* Comvert solar date dd/mm/yyyy to the corresponding lunar date */
function convertSolar2Lunar(dd, mm, yy, timeZone) {
	var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
	dayNumber = jdFromDate(dd, mm, yy);
	k = INT((dayNumber - 2415021.076998695) / 29.530588853);
	monthStart = getNewMoonDay(k+1, timeZone);
	if (monthStart > dayNumber) {
		monthStart = getNewMoonDay(k, timeZone);
	}
	//alert(dayNumber+" -> "+monthStart);
	a11 = getLunarMonth11(yy, timeZone);
	b11 = a11;
	if (a11 >= monthStart) {
		lunarYear = yy;
		a11 = getLunarMonth11(yy-1, timeZone);
	} else {
		lunarYear = yy+1;
		b11 = getLunarMonth11(yy+1, timeZone);
	}
	lunarDay = dayNumber-monthStart+1;
	diff = INT((monthStart - a11)/29);
	lunarLeap = 0;
	lunarMonth = diff+11;
	if (b11 - a11 > 365) {
		leapMonthDiff = getLeapMonthOffset(a11, timeZone);
		if (diff >= leapMonthDiff) {
			lunarMonth = diff + 10;
			if (diff == leapMonthDiff) {
				lunarLeap = 1;
			}
		}
	}
	if (lunarMonth > 12) {
		lunarMonth = lunarMonth - 12;
	}
	if (lunarMonth >= 11 && diff < 4) {
		lunarYear -= 1;
	}
	return new Array(lunarDay, lunarMonth, lunarYear, lunarLeap);
}

/* Convert a lunar date to the corresponding solar date */
function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
	var k, a11, b11, off, leapOff, leapMonth, monthStart;
	if (lunarMonth < 11) {
		a11 = getLunarMonth11(lunarYear-1, timeZone);
		b11 = getLunarMonth11(lunarYear, timeZone);
	} else {
		a11 = getLunarMonth11(lunarYear, timeZone);
		b11 = getLunarMonth11(lunarYear+1, timeZone);
	}
	k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
	off = lunarMonth - 11;
	if (off < 0) {
		off += 12;
	}
	if (b11 - a11 > 365) {
		leapOff = getLeapMonthOffset(a11, timeZone);
		leapMonth = leapOff - 2;
		if (leapMonth < 0) {
			leapMonth += 12;
		}
		if (lunarLeap != 0 && lunarMonth != leapMonth) {
			return new Array(0, 0, 0);
		} else if (lunarLeap != 0 || off >= leapOff) {
			off += 1;
		}
	}
	monthStart = getNewMoonDay(k+off, timeZone);
	return jdToDate(monthStart+lunarDay-1);
}

const showUseage = () => {
	document.getElementById('useage').style.zIndex = 1;
	document.getElementById('questionIconView').style.zIndex = -1;

}

const hideUseage = () => {
	document.getElementById('useage').style.zIndex = -1;
	document.getElementById('questionIconView').style.zIndex = 1;
}

renderCalendar();
renderNoteView();