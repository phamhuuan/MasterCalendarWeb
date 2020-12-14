const date = new Date();
const selectedDate = new Date();
let selectedTab = 0;
let isAdd = true;
// let noteList = "{\"Mon Dec 14 2020\":[\"a\",\"b\",\"c\"]}";
let noteList;
try {
	noteList = localStorage.getItem('noteList');
	if (!noteList) {
		noteList = JSON.stringify({});
	}
} catch (error) {
	noteList = JSON.stringify({});
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
		days += `<div onclick={setSelectDate(${currentDate})} class="prev-date">${prevLastDay - x + 1}</div>`;
	}
	for (let i = 1; i <= lastDay; i++) {
		currentDate = new Date(year, month, i).getTime();
		if (
			i === new Date().getDate() &&
			month === new Date().getMonth() &&
			year === new Date().getFullYear()
		) {
			days += `<div onclick={setSelectDate(${currentDate})} class="today">${i}</div>`;
		} else {
			if (
				i === selectedDate.getDate() &&
				month === selectedDate.getMonth() &&
				year === selectedDate.getFullYear()
			) {
				days += `<div onclick={setSelectDate(${currentDate})} class="otherDay selectedDay">${i}</div>`;
			} else {
				days += `<div onclick={setSelectDate(${currentDate})} class="otherDay">${i}</div>`;
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
	let noteList2 = JSON.parse(noteList);
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
		noteView += `<div class="noteList">`;
		if (noteList2 && noteList2[selectedDate.toDateString()]) {
			noteList2[selectedDate.toDateString()].forEach((item) => {
				noteView += `<div class="noteEventItem">
					<div class="noteEventIcon"></div>
					<p class="noteEventText">${item.replace('\n', '<br>')}</p>
				</div>`;
			});
		}
		noteView += `</div>`;
		if (isAdd) {
			noteView += `<div class="addView">
				<textarea class="addTextArea" id="addNoteArea"></textarea>
				<div class="controlView">
					<div class="button" onclick={addNote()}>Add</div>
				</div>
			</div>`;
		}
	}
	if (selectedTab === 1) {
		noteView += `<ul class="eventList"></ul>`;
	}
	noteEvent.innerHTML = noteView;
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
			default:
				break;
		}
	}
});

const setSelectDate = (newDate) => {
	newDate = new Date(newDate);
	selectedDate.setDate(newDate.getDate());
	selectedDate.setMonth(newDate.getMonth());
	date.setMonth(newDate.getMonth());
	selectedDate.setFullYear(newDate.getFullYear());
	date.setFullYear(newDate.getFullYear());
	renderCalendar();
	renderNoteView();
}

const setSelectedTab = (tab) => {
	selectedTab = tab;
	renderNoteView();
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
		try {
			localStorage.setItem('noteList', noteList);
		} catch (error) {}
		renderCalendar();
		renderNoteView();
	}
}

renderCalendar();
renderNoteView();