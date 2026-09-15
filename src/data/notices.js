// src/data/notices.js
import { getRelativeDeadline } from "../utils/dateUtils";

const notices = [
  {
    id: "notice-001",
    title: "Irrigation Engineering Assignment Submission",
    category: "Assignment",
    type: "urgent",
    date: "2026-09-15",
    deadline: getRelativeDeadline("2026-09-15T09:00:00"), // Rendered only when present
    isUrgent: true,
    showAsPopup: true,
    description: "Final deadline for Civil 6th Semester Irrigation Assignment 1.",
    image: "/assets/notices/irrigation-assign.png",
    downloadLink: "/assets/notices/irrigation-assignment-submission.png",
    // Custom Navigation target for specific semester/assignments:
targetLink: "/semester/civil/6",
    actionText: "Go to 6th Sem Assignment →"
  },
  {
    id: "notice-002",
    title: "2nd Semester Regular Exam Routine 2083",
    category: "Exam",
    type: "new",
    date: "2026-03-10",
    deadlineDate: null,
    // No deadline field needed
    isUrgent: false,
    showAsPopup: false,
    description: "Official examination schedule for B.E. 2nd Semester students across all faculties.",
    image: "/assets/notices/second-sem-exam.jpg",
    downloadLink: "/assets/notices/exam-routine-2nd-sem.png"
    // No targetLink needed: notice stays self-contained
  },
  {
    id: "notice-003",
    title: "4th Semester Regular Exam Routine 2083",
    category: "Exam",
    type: "update",
    date: "2026-03-08",
    isUrgent: false,
    showAsPopup: false,
    description: "Mid-term internal assessment timetable for Computer and Civil Engineering 4th Semester.",
    image: "/assets/notices/4th-sem-exam.jpg",
    downloadLink: "/assets/notices/exam-routine-4th-sem.png"
  }
];


export default notices;




/* 
DUMMY NOTICE */
/*
 {
    id: "notice-001",
    title: "Irrigation Engineering Assignment Submission",
    category: "Assignment",
    type: "urgent",
    date: "2026-03-15",
    deadline: "Tomorrow, 5:00 PM", // Rendered only when present
    isUrgent: true,
    showAsPopup: true,
    description: "Final deadline for Civil 6th Semester Irrigation Assignment 2. Make sure to submit hard copies at the department office.",
    image: "/assets/notices/irrigation-assign.png",
    downloadLink: "/assets/notices/irrigation-assignment-submission.png",
    // Custom Navigation target for specific semester/assignments:
    targetLink: "/semesters/civil-6th", 
    actionText: "Go to 6th Sem Assignment →"
  },  m
  */