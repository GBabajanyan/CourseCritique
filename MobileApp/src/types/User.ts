type userDataType = {
  name: string;
  avatar: string;
  role: string;
  degree: string;
  year: "Senior" | "Junior" | "Somphomore" | "Freshman";
  feedbacksGiven: number;
  feedbacksToFill: number;
  email: string;
  studentId: string;
  currentSemester: `${SemesterType} ${YearType}`;
};

type SemesterType = "Fall" | "Spring" | "Summer";

type YearType = number;

type UserBadgeType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
};

type EventType = {
  id: number;
  title: string;
  time: string;
  date: Date;
};

export { EventType, UserBadgeType, userDataType };
